from pyloid import Pyloid
from pyloid.serve import pyloid_serve
from pyloid.tray import (
    TrayEvent,
)
from pyloid.utils import (
    get_production_path,
    is_production,
)
from server import server


name = 'EmbedScope'

app = Pyloid(app_name=name, single_instance=True, server=server)

app.set_icon(get_production_path('src-pyloid/icons/icon.png'))
app.set_tray_icon(get_production_path('src-pyloid/icons/icon.png'))


############################## Tray ################################
def on_double_click():
    app.show_and_focus_main_window()


app.set_tray_actions(
    {
        TrayEvent.DoubleClick: on_double_click,
    }
)
app.set_tray_menu_items(
    [
        {'label': 'Show Window', 'callback': app.show_and_focus_main_window},
        {'label': 'Exit', 'callback': app.quit},
    ]
)
####################################################################

if is_production():
    url = pyloid_serve(directory=get_production_path('dist-front'))
    window = app.create_window(
        title=f'{name}-production',
    )
    window.load_url(url)
else:
    window = app.create_window(
        title=f'{name}-dev',
        dev_tools=True,
    )
    window.load_url('http://localhost:5173')

window.show_and_focus()

app.run()
