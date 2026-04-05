from collections.abc import Sequence
from importlib import import_module
from os import PathLike
from threading import Lock
from types import ModuleType
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    import torch


class InferenceManager:
    def __init__(self):
        self.torch: ModuleType | None = None
        self.torchvision: ModuleType | None = None

        self.device: torch.device | None = None

        self.encoder: torch.nn.Module | None = None
        self.model: torch.nn.Module | None = None

        self.lock = Lock()

    def initialize(self):
        self.load_torch()
        self.construct_model()

    def load_torch(self):
        with self.lock:
            if self.torch is None:
                self.torch = import_module('torch')
                self.torchvision = import_module('torchvision')

                self.device = self.torch.device('cuda' if self.torch.cuda.is_available() else 'cpu')

                print(f'Using device: {self.device}')

    def load_model(self, path: PathLike[str] | str):
        if self.model is None or self.torch is None:
            raise RuntimeError(f'Call {self.construct_model.__name__}() first.')

        self.model.load_state_dict(self.torch.load(path, map_location=self.device))

        self.model.eval()

    def infer(self, support_strs: Sequence[str], support_labels_str_list: Sequence[str], query_strs: Sequence[str]) -> Sequence[str]:
        if self.model is None or self.torch is None:
            raise RuntimeError(f'Call {self.construct_model.__name__}() first.')

        if len(support_strs) != len(support_labels_str_list):
            raise ValueError('Length of support_strs and support_labels_str_list must be the same.')

        support = self.torch.stack([self._load_image(s) for s in support_strs])  # (n_way*k_shot, 1, H, W)
        query = self.torch.stack([self._load_image(s) for s in query_strs])  # (n_way*q_query, 1, H, W)

        support_labels_list = tuple(range(len(support_labels_str_list)))
        support_labels = self.torch.tensor(support_labels_list)  # (n_way*k_shot,)

        with self.torch.no_grad():
            support: torch.Tensor = support.to(self.device)
            query: torch.Tensor = query.to(self.device)
            support_labels: torch.Tensor = support_labels.to(self.device)

            logits: torch.Tensor = self.model(support, support_labels, query)

            pred_labels = logits.argmax(dim=1)

            pred_labels_list: list[int] = pred_labels.cpu().tolist()

            return [support_labels_str_list[label] for label in pred_labels_list]

    def _load_image(self, path_str: str, transform: torch.nn.Module | None = None) -> torch.Tensor:
        if self.torchvision is None:
            raise RuntimeError(f'Call {self.load_model.__name__}() first.')

        image = self.torchvision.io.decode_image(path_str)

        if transform:
            image = transform(image)

        image: torch.Tensor = image.float() / 255

        return image

    def construct_model(self):
        if self.torch is None:
            raise RuntimeError(f'Call {self.load_model.__name__}() first.')

        torch = self.torch

        class Encoder(self.torch.nn.Module):
            def __init__(self, in_channels=1, feature_channels=64, embed_dim=64) -> None:
                super().__init__()

                self.encoder = torch.nn.Sequential(
                    torch.nn.Conv2d(in_channels, feature_channels, 3, padding=1),
                    torch.nn.BatchNorm2d(feature_channels),
                    torch.nn.ReLU(),
                    torch.nn.MaxPool2d(2),
                    torch.nn.Conv2d(feature_channels, feature_channels, 3, padding=1),
                    torch.nn.BatchNorm2d(feature_channels),
                    torch.nn.ReLU(),
                    torch.nn.MaxPool2d(2),
                    torch.nn.Conv2d(feature_channels, feature_channels, 3, padding=1),
                    torch.nn.BatchNorm2d(feature_channels),
                    torch.nn.ReLU(),
                    torch.nn.MaxPool2d(2),
                    torch.nn.Conv2d(feature_channels, embed_dim, 3, padding=1),
                    torch.nn.BatchNorm2d(embed_dim),
                    torch.nn.ReLU(),
                    torch.nn.AdaptiveAvgPool2d(1),  # (batch, embed_dim, 1, 1)
                )

            def forward(self, x: torch.Tensor):
                x = self.encoder(x)
                return x.view(x.size(0), -1)  # flatten to (batch, embed_dim)

        class ProtoNet(self.torch.nn.Module):
            def __init__(self, encoder: torch.nn.Module) -> None:
                super().__init__()

                self.encoder: torch.nn.Module = encoder

            def forward(self, support: torch.Tensor, support_labels: torch.Tensor, query: torch.Tensor) -> torch.Tensor:
                """
                support: (n_way*k_shot, 1, H, W)
                support_labels: (n_way*k_shot,)
                query: (n_way*q_query, 1, H, W)

                return:
                    logits: (n_way*q_query, n_way)
                """
                # 1. embed support and query
                embed_support: torch.Tensor = self.encoder(support)  # (n_way*k_shot, embed_dim)
                embed_query: torch.Tensor = self.encoder(query)  # (n_way*q_query, embed_dim)

                # 2. compute prototypes
                unique_labels = torch.unique(support_labels)  # [0,1,2,...,n_way-1]
                prototypes_list = []
                for c in unique_labels:
                    # mean of embeddings for class c
                    embed_class = embed_support[support_labels == c]
                    prototypes_list.append(embed_class.mean(0))

                prototypes: torch.Tensor = torch.stack(prototypes_list)  # (n_way, embed_dim)

                # 3. compute negative distances as logits
                # dist: (n_query, n_way)
                dist = torch.cdist(embed_query, prototypes) ** 2

                # negative distance = higher score if closer
                logits = -dist

                return logits

        self.encoder = Encoder(in_channels=1, feature_channels=64, embed_dim=64)
        self.model = ProtoNet(self.encoder).to(self.device)


if __name__ == '__main__':
    import time

    support_strs = [
        '../../../omniglot/python/images_evaluation/Angelic/character02/0966_01.png',
        '../../../omniglot/python/images_evaluation/Angelic/character01/0965_01.png',
    ]
    support_labels_str_list = [
        'character02',
        'character01',
    ]
    query_strs = [
        '../../../omniglot/python/images_evaluation/Angelic/character01/0965_02.png',
        '../../../omniglot/python/images_evaluation/Angelic/character02/0966_02.png',
    ]

    inference_manager = InferenceManager()

    inference_manager.initialize()

    inference_manager.load_model('best_model.pth')

    start_time = time.perf_counter()
    pred_labels = inference_manager.infer(support_strs, support_labels_str_list, query_strs)
    end_time = time.perf_counter()

    print(f'Time spent: {end_time - start_time:.4f}s')
    print(pred_labels)
