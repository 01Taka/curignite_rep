export class FunctionManager<T, K> {
  private functionMap: Map<string, (data: T) => void> = new Map();
  private functionConversionMap: Map<(data: K) => void, (data: T) => void> = new Map();

  constructor() { }

  private generateKey(keys: string[]): string {
    return keys.join('_');
  }

  /**
   * 指定されたキーでT型のデータを受け取る関数を登録
   */
  registerFunction(func: (data: T) => void, ...keys: string[]) {
    this.functionMap.set(this.generateKey(keys), func);
  }

  /**
   * 指定されたキーの関数を取得
   */
  getFunction(...keys: string[]): ((data: T) => void) | null {
    return this.functionMap.get(this.generateKey(keys)) ?? null;
  }

  /**
   * 指定されたキーの関数を削除
   */
  deleteFunction(...keys: string[]) {
    this.functionMap.delete(this.generateKey(keys));
  }

  /**
   * T型の関数とK型の関数の変換関数を登録
   */
  registerConversion(kFunc: (data: K) => void, tFunc: (data: T) => void) {
    this.functionConversionMap.set(kFunc, tFunc);
  }

  /**
   * T型の関数に対応するK型の関数を取得
   */
  getConversion(kFunc: (data: K) => void): ((data: T) => void) | null {
    return this.functionConversionMap.get(kFunc) ?? null;
  }

  /**
   * T型の関数に対応するK型の関数を削除
   */
  deleteConversion(kFunc: (data: K) => void) {
    this.functionConversionMap.delete(kFunc);
  }

  /**
   * T型のデータに対して関数を実行し、対応するK型の関数があればK型のデータで実行
   */
  executeWithConversion(kFunc: (data: K) => void, data: K, tData: T) {
    const conversion = this.functionConversionMap.get(kFunc);
    if (conversion) {
      conversion(tData);
    } else {
      kFunc(data);
    }
  }
}
