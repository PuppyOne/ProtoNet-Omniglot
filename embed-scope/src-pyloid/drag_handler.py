from pyloid.browser_window import BrowserWindow
from PySide6.QtCore import QEvent, QObject, Qt


class DragEventFilter(QObject):
    def eventFilter(self, obj, event) -> bool:
        # if event.type() == QEvent.Type.DragEnter:
        #     print(event.possibleActions())
        #     event.setDropAction(Qt.DropAction.CopyAction)
        #     event.accept()
        #     return True

        if event.type() == QEvent.Type.DragMove:
            print(event.position())
            event.setDropAction(Qt.DropAction.CopyAction)
            event.accept()
            return True

        # if event.type() == QEvent.Type.DragLeave:
        #     print("leave")
        #     return True

        if event.type() == QEvent.Type.Drop:
            print(event.mimeData().urls()[0])
            return True

        return False


drag_event_filter = DragEventFilter()


def register_drag_handler(window: BrowserWindow):
    # NOTE: Pyloid 未暴露拖放相关 API, 为获取真实路径需要拿到包装的 QWebEngine
    return window._window.web_view.installEventFilter(drag_event_filter)
