import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

import cargoConfig from '../src-tauri/Cargo.toml';


const PORTABLE_DIR = 'portable';
const PYEMBED_DIR = 'src-tauri/pyembed';

const exe_name: string = `${cargoConfig.bin[0].name}.exe`;

await rm(PORTABLE_DIR, { recursive: true, force: true });

await mkdir(PORTABLE_DIR);

await cp(join('target/bundle-release', exe_name), join(PORTABLE_DIR, exe_name));
await cp(join(PYEMBED_DIR, 'python'), PORTABLE_DIR, { recursive: true });
