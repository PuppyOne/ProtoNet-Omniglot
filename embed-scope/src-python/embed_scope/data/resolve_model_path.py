from .base_model import CommandBaseModel


class ResolvePathInput(CommandBaseModel):
    model_folder_name: str
    file_name: str
