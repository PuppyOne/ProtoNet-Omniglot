import { exists } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { $ } from 'bun';


const PROJECT_NAME = 'pytauri-app';
const platform = os.platform();

const PYTHON_PATH =
  platform === 'win32'
    ? 'src-tauri/pyembed/python/python.exe'
    : 'src-tauri/pyembed/python/bin/python3';

const PYLIB_DIR = path.resolve('src-tauri/pyembed/python/lib');

Bun.env.PYTAURI_STANDALONE = '1';
Bun.env.PYO3_PYTHON = path.resolve(PYTHON_PATH);

if (platform !== 'win32') {
  if (platform === 'linux') {
    Bun.env.RUSTFLAGS = `-C link-arg=-Wl,-rpath,$ORIGIN/../lib/${PROJECT_NAME}/lib -L ${PYLIB_DIR}`;
  } else if (platform === 'darwin') {
    Bun.env.RUSTFLAGS = `-C link-arg=-Wl,-rpath,@executable_path/../Resources/lib -L ${PYLIB_DIR}`;
  }
}

if (!(await exists(PYTHON_PATH))) await $`bun download-py`;

console.log('Installing Python package into embedded env...');

await $`uv pip install \
  --exact \
  --compile-bytecode \
  --python=${Bun.env.PYO3_PYTHON} \
  --reinstall-package=${PROJECT_NAME} \
  .`;

console.log('Building Tauri bundle...');

await $`pnpm tauri build --config=src-tauri/tauri.bundle.json -- --profile bundle-release`;

console.log('✅ Build done');
