export type CallbackData<T> = (data: T[]) => Promise<void>;

export type Stringify<T> = {
  [P in keyof T]: string;
};

export type HexColorCode = `#${string}`;