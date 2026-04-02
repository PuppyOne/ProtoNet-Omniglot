import { exists, mkdir } from 'node:fs/promises';
import { arch, platform } from 'node:os';

import { $ } from 'bun';


const PYTHON_VERSION = '3.14.3';
const TAG = '20260203';

const PLATFORM_MAP = {
  win32: 'x86_64-pc-windows-msvc',
  linux: 'x86_64-unknown-linux-gnu',
  darwin: arch() === 'arm64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin',
};

const target = PLATFORM_MAP[platform() as keyof typeof PLATFORM_MAP];

if (!target) {
  throw new TypeError(`Unsupported platform: ${platform()}`);
}

const url = `https://github.com/astral-sh/python-build-standalone/releases/download/${TAG}/cpython-${PYTHON_VERSION}+${TAG}-${target}-install_only_stripped.tar.gz`;

const DEST_DIR = 'src-tauri/pyembed';

if (await exists(DEST_DIR)) {
  throw new Error(`Destination directory ${DEST_DIR} already exists.`);
}

console.log(`⬇ Downloading Python standalone for ${target}...`);

await mkdir(DEST_DIR, { recursive: true });

const tmp = '.python.tar.gz';

await $`curl -L ${url} -o ${tmp}`;
await $`tar -xzf ${tmp} -C ${DEST_DIR}`;
await $`rm ${tmp}`;

if (platform() === 'darwin') {
  const majorMinor = PYTHON_VERSION.split('.').slice(0, 2).join('.');
  const dylib = `${DEST_DIR}/python/lib/libpython${majorMinor}.dylib`;

  console.log('🔧 Fixing macOS dylib id...');
  await $`install_name_tool -id @rpath/libpython${majorMinor}.dylib ${dylib}`;
}

console.log('✅ Python standalone ready');
