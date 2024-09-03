import { IndexedDBHandler } from "./indexedDBHandler";

export class IndexedDBFactory {
  private static instances: { [key: string]: IndexedDBHandler<any> } = {};

  // Factoryメソッド
  public static getHandler<T>(dbName: string, storeName: string, version: number = 1): IndexedDBHandler<T> {
    const key = `${dbName}_${storeName}_${version}`;

    // すでにインスタンスが存在する場合はそれを返す
    if (IndexedDBFactory.instances[key]) {
      return IndexedDBFactory.instances[key];
    }

    // 新しいインスタンスを作成し、保存
    const handler = new IndexedDBHandler<T>(dbName, storeName, version);
    IndexedDBFactory.instances[key] = handler;

    return handler;
  }
}