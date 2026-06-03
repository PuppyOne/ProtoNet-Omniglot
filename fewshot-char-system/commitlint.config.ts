import type { UserConfig } from '@commitlint/types';


const configuration = {
  extends: ['@commitlint/config-conventional'],
} as const satisfies UserConfig;

export default configuration;
