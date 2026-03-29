import base64
import mimetypes

import aiofiles
from constants.rpc_error_type import RPCErrorType
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
