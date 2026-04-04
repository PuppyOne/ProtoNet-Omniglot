from datetime import datetime
from pathlib import Path

from pydantic import Field, RootModel

from .base_model import CommandBaseModel


class ModelTrainMeta(CommandBaseModel):
    timestamp: datetime
    framework: str

    n_way: int = Field(..., gt=0)
    k_shot: int = Field(..., gt=0)
    q_query: int = Field(..., gt=0)

    train_batches: int = Field(..., gt=0)
    val_batches: int = Field(..., gt=0)
    test_batches: int = Field(..., gt=0)

    early_stop_patience: int = Field(..., ge=0)


class ModelMeta(CommandBaseModel):
    name: str
    architecture: str
    encoder: str
    dataset: str

    version: list[int] = Field(..., min_length=3, max_length=3)

    embedding_dim: int = Field(..., gt=0)

    train: ModelTrainMeta


class Metrics(CommandBaseModel):
    test_loss: float = Field(..., ge=0)
    test_accuracy: float = Field(..., ge=0, le=1)
    n_way: int = Field(..., gt=0)
    k_shot: int = Field(..., gt=0)
    q_query: int = Field(..., gt=0)
    test_batches: int = Field(..., gt=0)


class EpochLog(CommandBaseModel):
    epoch: int = Field(..., ge=0)
    train_loss: float = Field(..., ge=0)
    val_loss: float = Field(..., ge=0)
    val_accuracy: float = Field(..., ge=0, le=1)


class TrainLogs(RootModel):
    root: list[EpochLog]


class Folder(CommandBaseModel):
    name: str
    path: Path


class Model(CommandBaseModel):
    meta: ModelMeta
    metrics: Metrics
    train_logs: TrainLogs

    folder: Folder


class ModelsOutput(RootModel):
    root: list[Model]
