export type PathStructure = {
  _abs: string; // 絶対パス
  _rel: string; // 相対パス
  _param?: string;
  [key: string]: PathStructure | string | undefined; // ネストされたキーも許可
};
