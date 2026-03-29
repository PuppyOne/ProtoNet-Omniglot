import base64
import mimetypes
import time
from collections.abc import Sequence
from pathlib import Path

import aiofiles
from constants.rpc_error_type import RPCErrorType
from infer import infer as model_infer
from pyloid.rpc import PyloidRPC, RPCContext


server = PyloidRPC()


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
async def infer(support_dir: str, query_strs: Sequence[str]) -> Sequence[str]:
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
