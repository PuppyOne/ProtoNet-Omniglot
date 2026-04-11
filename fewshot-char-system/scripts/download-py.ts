import { mkdir , rm } from 'node:fs/promises';
import { arch, platform } from 'node:os';

import { $ } from 'bun';


const PYTHON_VERSION = '3.14.3';
const TAG = '20260203';

const DEST_DIR = 'src-tauri/pyembed';
const TMP_FILE = '.python.tar.gz';

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

await rm(DEST_DIR, { recursive: true, force: true });

console.log(`⬇ Downloading Python standalone for ${target}...`);

await mkdir(DEST_DIR, { recursive: true });

await $`curl -L ${url} -o ${TMP_FILE}`;
await $`tar -xzf ${TMP_FILE} -C ${DEST_DIR}`;
await $`rm ${TMP_FILE}`;

if (platform() === 'darwin') {
  const majorMinor = PYTHON_VERSION.split('.').slice(0, 2).join('.');
  const dylib = `${DEST_DIR}/python/lib/libpython${majorMinor}.dylib`;

  console.log('🔧 Fixing macOS dylib id...');
  await $`install_name_tool -id @rpath/libpython${majorMinor}.dylib ${dylib}`;
}

console.log('✅ Python standalone ready');
