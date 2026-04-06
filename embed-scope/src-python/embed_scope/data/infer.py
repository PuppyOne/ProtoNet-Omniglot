from collections.abc import Sequence

from .base_model import CommandBaseModel


class InferInput(CommandBaseModel):
    model_folder_name: str
    query_strs: Sequence[str]


class InferOutput(CommandBaseModel):
    prediction: list[str]
    confidences: list[dict[str, float]]
    time_spent_s: float

    request: InferInput
