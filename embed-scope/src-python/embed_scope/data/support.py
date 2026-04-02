from enum import StrEnum

from pydantic import ConfigDict, RootModel

from .base_model import CommandBaseModel


class ImageFormat(StrEnum):
    """支持的图像格式枚举"""

    PNG = 'png'
    JPG = 'jpg'
    JPEG = 'jpeg'
    BMP = 'bmp'
    GIF = 'gif'


class SupportImage(CommandBaseModel):
    """
    单个支持图像的模型

    Attributes:
        name: 图像文件名（不包含扩展名）
        filename: 完整文件名（包含扩展名）
        filepath: 文件完整路径
        ext: 文件扩展名（不包含点）
    """

    name: str
    filename: str
    filepath: str
    ext: ImageFormat

    model_config = ConfigDict(json_schema_extra={'example': {'name': '0966_01', 'filename': '0966_01.png', 'filepath': '/path/to/character01/0966_01.png', 'ext': 'png'}})


class SupportsOutput(RootModel):
    """
    获取所有字符支持图像的响应模型
    """

    root: dict[str, list[SupportImage]]

    model_config = ConfigDict(
        json_schema_extra={
            'example': {
                'character01': [
                    {'name': '0966_01', 'filename': '0966_01.png', 'filepath': '/path/to/character01/0966_01.png', 'ext': 'png'},
                    {'name': '0966_02', 'filename': '0966_02.png', 'filepath': '/path/to/character01/0966_02.png', 'ext': 'png'},
                ],
                'character02': [{'name': '1389_01', 'filename': '1389_01.png', 'filepath': '/path/to/character02/1389_01.png', 'ext': 'png'}],
            }
        }
    )
