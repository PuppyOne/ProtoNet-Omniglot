export type OverrideProps<T, U> = Omit<T, keyof U> & U;
