from typing import TypedDict


class DropData(TypedDict):
    paths: list[str]
    position: tuple[float, float]
