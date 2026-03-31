export interface Support {
  filename: string;
  name: string;
  src: string;
  ext: string;
}

export type CharacterSupports = Record<string, Support[]>;
