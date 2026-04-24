import { getCurrentWindow } from '@tauri-apps/api/window';
import { use } from 'react';


const titlePromise = getCurrentWindow().title();

export default function WindowTitle() {
  const title = use(titlePromise);

  return (
    <>
      {title}
      {import.meta.env.DEV && '-dev'}
    </>
  );
}
