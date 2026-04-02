from collections.abc import Sequence

from .base_model import CommandBaseModel


class InferInput(CommandBaseModel):
    support_dir: str
    query_strs: Sequence[str]
