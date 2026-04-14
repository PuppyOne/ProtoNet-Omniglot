import asyncio
from collections.abc import Sequence
from importlib import import_module
from os import PathLike
from types import ModuleType
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    import torch
    import torchvision


class InferenceManager:
    def __init__(self):
        self.torch: ModuleType | None = None
        self.torchvision: ModuleType | None = None

        self.device: torch.device | None = None

        self.encoder: torch.nn.Module | None = None
        self.classifier: torch.nn.Module | None = None

        self.transform: torchvision.transforms.Compose | torch.nn.Module | None = None

        self.lock = asyncio.Lock()

    async def initialize(self):
        await self.load_torch()

    async def load_torch(self):
        async with self.lock:
            if self.torch is None:

                def _import_torch():
                    self.torch = import_module('torch')
                    self.torchvision = import_module('torchvision')

                    self.device = self.torch.device('cuda' if self.torch.cuda.is_available() else 'cpu')

                    self.transform = self.torchvision.transforms.Resize((105, 105))

                await asyncio.to_thread(_import_torch)

                print(f'Using device: {self.device}')

    def load_model(self, encoder_path: PathLike[str] | str, classifier_path: PathLike[str] | str):
        if self.torch is None:
            raise RuntimeError(f'Call {self.load_torch.__name__}() first.')

        self.encoder = self.torch.export.load(encoder_path).module()
        self.classifier = self.torch.export.load(classifier_path).module()

    def infer(self, support_strs: Sequence[str], support_labels_str_list: Sequence[str], query_strs: Sequence[str]) -> tuple[list[str], list[dict[str, float]]]:
        if self.encoder is None or self.classifier is None or self.torch is None:
            raise RuntimeError(f'Call {self.load_model.__name__}() first.')

        if len(support_strs) != len(support_labels_str_list):
            raise ValueError('Length of support_strs and support_labels_str_list must be the same.')

        support = self.torch.stack([self._load_image(s) for s in support_strs])  # (n_way*k_shot, 1, H, W)
        query = self.torch.stack([self._load_image(s) for s in query_strs])  # (n_way*q_query, 1, H, W)

        # 字符串 整数  双向映射
        str_to_int: dict[str, int] = {}
        int_to_str: dict[int, str] = {}
        next_id = 0

        support_labels_list: list[int] = []
        for support_labels_str in support_labels_str_list:
            if support_labels_str not in str_to_int:
                str_to_int[support_labels_str] = next_id
                int_to_str[next_id] = support_labels_str
                next_id += 1
            support_labels_list.append(str_to_int[support_labels_str])

        support_labels = self.torch.tensor(support_labels_list)  # (n_way*k_shot,)

        with self.torch.no_grad():
            support: torch.Tensor = support.to(self.device)
            query: torch.Tensor = query.to(self.device)
            support_labels: torch.Tensor = support_labels.to(self.device)

            embed_support = self.encoder(support)
            embed_query = self.encoder(query)

            logits: torch.Tensor = self.classifier(embed_support, support_labels, embed_query)

            pred_labels = logits.argmax(dim=1)

            pred_labels_list: list[int] = pred_labels.cpu().tolist()

            # 反向映射
            pred_labels_str_list: list[str] = [int_to_str[label] for label in pred_labels_list]

            # softmax 得到概率
            softmax_probs: torch.Tensor = self.torch.nn.functional.softmax(logits, dim=1)

            # 映射成 [{class: confidence, ...}, ...]
            pred_conf: list[dict[str, float]] = [{int_to_str[i]: float(prob) for i, prob in enumerate(sample_probs)} for sample_probs in softmax_probs.cpu()]

            return pred_labels_str_list, pred_conf

    def _load_image(self, path_str: str) -> torch.Tensor:
        if self.torchvision is None:
            raise RuntimeError(f'Call {self.load_model.__name__}() first.')

        image = self.torchvision.io.decode_image(path_str, mode='GRAY')

        if self.transform:
            image = self.transform(image)

        image: torch.Tensor = image.float() / 255

        return image


if __name__ == '__main__':

    async def main():
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

        await inference_manager.initialize()

        inference_manager.load_model(
            '../../../models/ProtoNet_5_1/encoder.pt2',
            '../../../models/ProtoNet_5_1/classifier.pt2',
        )

        start_time = time.perf_counter()
        pred = inference_manager.infer(support_strs, support_labels_str_list, query_strs)
        end_time = time.perf_counter()

        print(f'Time spent: {end_time - start_time:.4f}s')
        print(pred)

    asyncio.run(main())
