import { platform, version } from '@tauri-apps/plugin-os';


/**Win11版本号10.0.22xxx */
export const isWin11 =
  platform() === 'windows' && version().startsWith('10.0.2');
