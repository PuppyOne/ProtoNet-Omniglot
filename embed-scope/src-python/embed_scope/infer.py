from collections.abc import Sequence

import torch
import torch.nn as nn
from torch import Tensor
from torchvision.io import decode_image


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

print(f'Using device: {device}')


class Encoder(nn.Module):
    def __init__(self, in_channels=1, feature_channels=64, embed_dim=64) -> None:
        super().__init__()

        self.encoder = nn.Sequential(
            nn.Conv2d(in_channels, feature_channels, 3, padding=1),
            nn.BatchNorm2d(feature_channels),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(feature_channels, feature_channels, 3, padding=1),
            nn.BatchNorm2d(feature_channels),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(feature_channels, feature_channels, 3, padding=1),
            nn.BatchNorm2d(feature_channels),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(feature_channels, embed_dim, 3, padding=1),
            nn.BatchNorm2d(embed_dim),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),  # (batch, embed_dim, 1, 1)
        )

    def forward(self, x: Tensor):
        x = self.encoder(x)
        return x.view(x.size(0), -1)  # flatten to (batch, embed_dim)


class ProtoNet(nn.Module):
    def __init__(self, encoder: nn.Module) -> None:
        super().__init__()

        self.encoder: nn.Module = encoder

    def forward(self, support: Tensor, support_labels: Tensor, query: Tensor) -> Tensor:
        """
        support: (n_way*k_shot, 1, H, W)
        support_labels: (n_way*k_shot,)
        query: (n_way*q_query, 1, H, W)

        return:
            logits: (n_way*q_query, n_way)
        """
        # 1. embed support and query
        embed_support: Tensor = self.encoder(support)  # (n_way*k_shot, embed_dim)
        embed_query: Tensor = self.encoder(query)  # (n_way*q_query, embed_dim)

        # 2. compute prototypes
        unique_labels = torch.unique(support_labels)  # [0,1,2,...,n_way-1]
        prototypes_list = []
        for c in unique_labels:
            # mean of embeddings for class c
            embed_class = embed_support[support_labels == c]
            prototypes_list.append(embed_class.mean(0))

        prototypes: Tensor = torch.stack(prototypes_list)  # (n_way, embed_dim)

        # 3. compute negative distances as logits
        # dist: (n_query, n_way)
        dist = torch.cdist(embed_query, prototypes) ** 2

        # negative distance = higher score if closer
        logits = -dist

        return logits


encoder = Encoder(in_channels=1, feature_channels=64, embed_dim=64)
model = ProtoNet(encoder).to(device)

model.load_state_dict(torch.load('models/best_model.pth', map_location=device))


model.eval()


def _load_image(path_str: str, transform: nn.Module | None = None) -> Tensor:
    image = decode_image(path_str)

    if transform:
        image = transform(image)

    image: Tensor = image.float() / 255

    return image


def infer(support_strs: Sequence[str], support_labels_str_list: Sequence[str], query_strs: Sequence[str]) -> Sequence[str]:
    if len(support_strs) != len(support_labels_str_list):
        raise ValueError('Length of support_strs and support_labels_str_list must be the same.')

    support = torch.stack([_load_image(s) for s in support_strs])  # (n_way*k_shot, 1, H, W)
    query = torch.stack([_load_image(s) for s in query_strs])  # (n_way*q_query, 1, H, W)

    support_labels_list = tuple(range(len(support_labels_str_list)))
    support_labels = torch.tensor(support_labels_list)  # (n_way*k_shot,)

    with torch.no_grad():
        support: Tensor = support.to(device)
        query: Tensor = query.to(device)
        support_labels: Tensor = support_labels.to(device)

        logits: Tensor = model(support, support_labels, query)

        pred_labels = logits.argmax(dim=1)

        pred_labels_list: list[int] = pred_labels.cpu().tolist()

        return [support_labels_str_list[label] for label in pred_labels_list]


if __name__ == '__main__':
    import time

    support_strs = [
        '../../omniglot/python/images_evaluation/Angelic/character02/0966_01.png',
        '../../omniglot/python/images_evaluation/Angelic/character01/0965_01.png',
    ]
    support_labels_str_list = [
        'character02',
        'character01',
    ]
    query_strs = [
        '../../omniglot/python/images_evaluation/Angelic/character01/0965_02.png',
        '../../omniglot/python/images_evaluation/Angelic/character02/0966_02.png',
    ]

    start_time = time.perf_counter()
    pred_labels = infer(support_strs, support_labels_str_list, query_strs)
    end_time = time.perf_counter()

    print(f'Time spent: {end_time - start_time:.4f}s')
    print(pred_labels)
