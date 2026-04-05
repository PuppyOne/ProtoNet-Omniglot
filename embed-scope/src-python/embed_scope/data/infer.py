from collections.abc import Sequence

from .base_model import CommandBaseModel


class InferInput(CommandBaseModel):
    model_folder_name: str
    query_strs: Sequence[str]
