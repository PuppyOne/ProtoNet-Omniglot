import json
import time
from collections.abc import Sequence
from pathlib import Path

from pytauri import Commands

from .constants.pytauri_gen_ts import PYTAURI_GEN_TS
from .data.infer import InferInput
from .data.model import ModelsOutput
from .data.support import SupportsOutput


support_path = './support'
models_path = './models'

commands = Commands(experimental_gen_ts=PYTAURI_GEN_TS)


@commands.command()
async def preload() -> None:
    from . import infer  # noqa: F401  preload module


@commands.command()
async def infer(body: InferInput) -> Sequence[str]:
    from .infer import infer as model_infer

    support_strs: list[str] = []
    support_labels_str_list: list[str] = []

    for character_path in Path(body.support_dir).iterdir():
        for image_path in character_path.iterdir():
            support_strs.append(image_path.as_posix())
            support_labels_str_list.append(character_path.name)

    start_time = time.perf_counter()
    prediction = model_infer(support_strs, support_labels_str_list, body.query_strs)
    end_time = time.perf_counter()

    print(f'Time spent: {end_time - start_time:.4f}s')

    return prediction


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
    JSON_NAMES = ['meta', 'metrics', 'train_logs']

    models = []

    for model_path in Path(models_path).iterdir():
        model = {}

        for json_name in JSON_NAMES:
            data = (model_path / f'{json_name}.json').read_text()

            model[json_name] = json.loads(data)

        model['folder'] = {'name': model_path.name, 'path': model_path.resolve().as_posix()}
        models.append(model)

    return ModelsOutput(models)
