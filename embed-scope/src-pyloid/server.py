import base64
import mimetypes
import time
from collections.abc import Sequence
from pathlib import Path

import aiofiles
from constants.rpc_error_type import RPCErrorType
from pyloid.rpc import PyloidRPC, RPCContext
from pyloid.serve import pyloid_serve


support_path = './support'

server = PyloidRPC()

Path(support_path).mkdir(parents=True, exist_ok=True)
support_url = pyloid_serve(support_path)


@server.method()
async def select_file(ctx: RPCContext) -> str | None:
    return ctx.pyloid.open_file_dialog()


@server.method()
async def select_folder(ctx: RPCContext) -> str | None:
    return ctx.pyloid.save_file_dialog()


@server.method()
async def read_image(path: str) -> str | dict[str, str]:
    async with aiofiles.open(path, 'rb') as f:
        data = await f.read()

    b64 = base64.b64encode(data).decode('utf-8')
    mime, _ = mimetypes.guess_type(path)

    if not mime or not mime.startswith('image/'):
        return {'error': RPCErrorType.UNSUPPORTED_FILE_TYPE}

    return f'data:{mime};base64,{b64}'


@server.method()
async def preload() -> None:
    import infer  # noqa: F401  preload module


@server.method()
async def infer(support_dir: str, query_strs: Sequence[str]) -> Sequence[str]:
    from infer import infer as model_infer

    support_strs: list[str] = []
    support_labels_str_list: list[str] = []

    for character_path in Path(support_dir).iterdir():
        for image_path in character_path.iterdir():
            support_strs.append(image_path.as_posix())
            support_labels_str_list.append(character_path.name)

    start_time = time.perf_counter()
    prediction = model_infer(support_strs, support_labels_str_list, query_strs)
    end_time = time.perf_counter()

    print(f'Time spent: {end_time - start_time:.4f}s')

    return prediction


@server.method()
async def get_supports() -> dict[str, list[dict[str, str]]]:
    """
    @example
    {
    "character01": [
        {
        "filename": "0966_01.png",
        "name": "0966_01",
        "src": "http://localhost:12345/character01/0966_01.png",
        "ext": "png"
        },
        {
        "filename": "0966_02.png",
        "name": "0966_02",
        "src": "http://localhost:12345/character01/0966_02.png",
        "ext": "png"
        }
    ],
    "character02": [
        {
        "filename": "1389_01.png",
        "name": "1389_01",
        "src": "http://localhost:12345/character02/1389_01.png",
        "ext": "png"
        }
    ]
    }
    """
    data: dict[str, list[dict[str, str]]] = {}

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
                    'src': f'{support_url}/{character_name}/{image_path.name}',
                    'ext': image_path.suffix.lstrip('.'),
                }
            )

    return data
