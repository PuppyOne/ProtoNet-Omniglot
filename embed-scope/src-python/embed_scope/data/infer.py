from collections.abc import Sequence

from .base_model import CommandBaseModel
from .model import Model


class InferInput(CommandBaseModel):
    model: Model
    query_strs: Sequence[str]


class InferOutput(CommandBaseModel):
    prediction: list[str]
    confidences: list[dict[str, float]]
    time_spent_s: float

    request: InferInput
