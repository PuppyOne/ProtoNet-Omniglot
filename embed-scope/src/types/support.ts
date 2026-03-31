export interface Support {
  filename: string;
  name: string;
  src: string;
  ext: string;
}

export type Supports = Record<string, Support[]>;
