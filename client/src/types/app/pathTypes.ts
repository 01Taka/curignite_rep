export type PathStructure = {
  _abs: string; // 絶対パス
  _rel: string; // 相対パス
  [key: string]: PathStructure | string; // ネストされたキーも許可
};
