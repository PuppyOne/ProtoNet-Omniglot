from datetime import datetime
from pathlib import Path

from pydantic import ConfigDict, Field, RootModel

from .base_model import CommandBaseModel


class EpochLog(CommandBaseModel):
    epoch: int = Field(..., ge=0)
    train_loss: float = Field(..., ge=0)
    val_loss: float | None = Field(default=None, ge=0)
    val_accuracy: float = Field(..., ge=0, le=1)


class TrainInfo(CommandBaseModel):
    timestamp: datetime
    framework: str

    n_way: int = Field(..., gt=0)
    k_shot: int = Field(..., gt=0)
    q_query: int = Field(..., gt=0)

    train_batches: int = Field(..., gt=0)
    val_batches: int = Field(..., gt=0)

    early_stop_patience: int | None = Field(default=None, ge=0)

    logs: list[EpochLog] | None = None


class Metrics(CommandBaseModel):
    test_loss: float | None = Field(default=None, ge=0)
    test_accuracy: float = Field(..., ge=0, le=1)

    n_way: int = Field(..., gt=0)
    k_shot: int = Field(..., gt=0)
    q_query: int = Field(..., gt=0)

    test_batches: int = Field(..., gt=0)


class ModelFiles(CommandBaseModel):
    encoder: str
    classifier: str

    model_config = ConfigDict(extra='allow')

    __pydantic_extra__: dict[str, str]


class ImageFiles(CommandBaseModel):
    loss_curve: str | None = None
    loss_curve_svg: str | None = None

    accuracy_curve: str | None = None
    accuracy_curve_svg: str | None = None

    t_sne: str | None = None
    t_sne_svg: str | None = None

    model_config = ConfigDict(extra='allow')

    __pydantic_extra__: dict[str, str]


class Files(CommandBaseModel):
    models: ModelFiles
    images: ImageFiles | None = None

    model_config = ConfigDict(extra='allow')

    __pydantic_extra__: dict[str, dict[str, str]]


class ModelMeta(CommandBaseModel):
    name: str
    architecture: str
    encoder: str
    dataset: str

    version: list[int] = Field(..., min_length=3, max_length=3)
    embedding_dim: int = Field(..., gt=0)

    train: TrainInfo
    metrics: Metrics
    files: Files


class Folder(CommandBaseModel):
    name: str
    path: Path


class Model(CommandBaseModel):
    meta: ModelMeta
    folder: Folder


class ModelsOutput(RootModel):
    root: list[Model] = []


class AddModelInput(CommandBaseModel):
    source_path: Path
    target_folder_name: str | None = None


class RemoveModelInput(CommandBaseModel):
    model_folder_name: str
