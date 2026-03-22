from collections.abc import Mapping, Sequence
from typing import Any

from data.drop_event_data import DropData
from pyloid.browser_window import BrowserWindow
from PySide6.QtCore import QEvent, QObject, Qt, QUrl
from PySide6.QtGui import QDropEvent


windows: list[BrowserWindow] = []


def urls_to_paths(urls: Sequence[QUrl]) -> list[str]:
    return [url.toLocalFile() for url in urls]


def format_event(event: QDropEvent) -> DropData:
    mimeData = event.mimeData()
    urls: list[QUrl] = mimeData.urls()
    paths = urls_to_paths(urls)

    position: tuple[float, float] = event.position().toTuple()  # type: ignore

    return {
        'paths': paths,
        'position': position,
    }


def invoke(event_name: str, data: Mapping[Any, Any]) -> None:
    for window in windows:
        window.invoke(event_name, data)  # type: ignore


class DragEventFilter(QObject):
    def eventFilter(self, obj, event) -> bool:
        if event.type() == QEvent.Type.DragEnter:
            print(event.possibleActions())
            event.setDropAction(Qt.DropAction.CopyAction)
            event.accept()

            invoke('drag_enter', format_event(event))

            return True

        if event.type() == QEvent.Type.DragMove:
            print(event.position().toTuple())
            event.setDropAction(Qt.DropAction.CopyAction)
            event.accept()

            invoke('drag_move', format_event(event))

            return True

        if event.type() == QEvent.Type.DragLeave:
            invoke('drag_leave', format_event(event))

            return True

        if event.type() == QEvent.Type.Drop:
            # NOTE: 拖放非文件 (如字符串) , 将返回空 []
            invoke('drop', format_event(event))

            return True

        return False


drag_event_filter = DragEventFilter()


def register_drag_handler(window: BrowserWindow) -> None:
    windows.append(window)

    # NOTE: Pyloid 未暴露拖放相关 API, 为获取真实路径需要拿到包装的 QWebEngine
    return window._window.web_view.installEventFilter(drag_event_filter)


def unregister_drag_handler(window: BrowserWindow) -> None:
    if window in windows:
        windows.remove(window)

        return window._window.web_view.removeEventFilter(drag_event_filter)
