import json
import time
from pathlib import Path

from pydantic import ValidationError
from pytauri import Commands
from pytauri.ipc import InvokeException
from send2trash import send2trash

from .constants.pytauri_gen_ts import PYTAURI_GEN_TS
from .data.infer import InferInput, InferOutput
from .data.model import AddModelInput, Model, ModelsOutput, RemoveModelInput
from .data.resolve_model_path import ResolvePathInput
from .data.support import SupportsOutput
from .infer import InferenceManager


support_path = './support'
models_path = './models'

commands = Commands(experimental_gen_ts=PYTAURI_GEN_TS)

inference_manager = InferenceManager()


@commands.command()
async def preload() -> None:
    inference_manager.initialize()


@commands.command()
async def infer(body: InferInput) -> InferOutput:
    support_strs: list[str] = []
    support_labels_str_list: list[str] = []

    for character_path in Path(support_path).iterdir():
        if not character_path.is_dir():
            continue

        for image_path in character_path.iterdir():
            if not image_path.is_file():
                continue

            support_strs.append(image_path.as_posix())
            support_labels_str_list.append(character_path.name)

    model_folder_name = body.model.folder.name
    encoder_path = models_path / Path(model_folder_name) / body.model.meta.files.models.encoder
    classifier_path = models_path / Path(model_folder_name) / body.model.meta.files.models.classifier

    inference_manager.load_model(encoder_path, classifier_path)
    start_time = time.perf_counter()
    prediction, confidences = inference_manager.infer(support_strs, support_labels_str_list, body.query_strs)
    end_time = time.perf_counter()

    time_spent_s = end_time - start_time

    print(f'Time spent: {time_spent_s:.4f}s')

    return InferOutput(prediction=prediction, time_spent_s=time_spent_s, confidences=confidences, request=body)


@commands.command()
async def get_supports() -> SupportsOutput:
    """
    @example
    {
        "character01": [
            {
            "filename": "0966_01.png",
            "name": "0966_01",
            "filepath": "/path/to/character01/0966_01.png",
            "ext": "png"
            },
            {
            "filename": "0966_02.png",
            "name": "0966_02",
            "filepath": "/path/to/character01/0966_02.png",
            "ext": "png"
            }
        ],
        "character02": [
            {
            "filename": "1389_01.png",
            "name": "1389_01",
            "filepath": "/path/to/character02/1389_01.png",
            "ext": "png"
            }
        ]
    }
    """
    data = {}

    for character_path in Path(support_path).iterdir():
        if not character_path.is_dir():
            continue

        character_name = character_path.name

        for image_path in character_path.iterdir():
            if not image_path.is_file():
                continue

            if image_path.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.bmp', '.gif'}:
                continue

            data.setdefault(character_name, []).append(
                {
                    'name': image_path.stem,
                    'filename': image_path.name,
                    'filepath': image_path.as_posix(),
                    'ext': image_path.suffix.lstrip('.'),
                }
            )

    return SupportsOutput(**data)


@commands.command()
async def get_models() -> ModelsOutput:
    JSON_NAME = 'meta'

    models = []

    for model_path in Path(models_path).iterdir():
        if not model_path.is_dir():
            continue

        try:
            model = {}

            meta = (model_path / f'{JSON_NAME}.json').read_text()

            model['meta'] = json.loads(meta)

            model['folder'] = {'name': model_path.name, 'path': model_path.resolve().as_posix()}

            model = Model(**model)

        except ValidationError as e:
            print(f'Unsupported model directory: {model_path.as_posix()}')
            print(e)

            continue

        except Exception as e:
            print(e)
            continue

        models.append(model)

    return ModelsOutput(models)


@commands.command()
async def resolveModelPath(body: ResolvePathInput) -> str:
    file_path = Path(models_path) / body.model_folder_name / body.file_name

    return file_path.resolve().as_posix()


@commands.command()
async def add_model(body: AddModelInput) -> None:
    if not body.source_path.is_dir():
        raise InvokeException('source_path is not a directory')

    if body.target_folder_name:
        body.source_path.copy(Path(models_path) / body.target_folder_name)
    else:
        body.source_path.copy_into(models_path)


@commands.command()
async def move_model_to_trash(body: RemoveModelInput) -> None:
    model_path = Path(models_path) / body.model_folder_name

    if not model_path.exists():
        raise InvokeException('model_folder_name does not exist')

    send2trash(model_path)
