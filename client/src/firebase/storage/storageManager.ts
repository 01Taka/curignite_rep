import { FirebaseStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { FileExtension } from "../../types/util/utilTypes";

export class StorageManager {
  constructor(private storage: FirebaseStorage) { }

  // ファイルのアップロード
  async uploadFile(
    path: string,
    id: string,
    format: FileExtension | '',
    file: File,
    maxSizeMB: number = 5
  ): Promise<string> {
    try {
      // ファイルサイズチェック (例: 5MB 以下)
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`ファイルサイズが大きすぎます。最大 ${maxSizeMB}MB です。`);
      }
  
      // ファイル拡張子の検証
      if (!file.type.includes(format)) {
        throw new Error(`指定された形式 ${format} と一致しません。`);
      }
  
      const storageRef = ref(this.storage, path);
      // ファイルのストレージ参照
      const fileRef = ref(storageRef, `${id}.${format}`);
  
      // アップロードの進行を追跡
      const uploadTask = uploadBytesResumable(fileRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('アップロード中にエラーが発生しました: ', error);
          throw new Error('アップロードに失敗しました');
        },
        () => {
          console.log('アップロードが完了しました');
        }
      );
  
      // アップロード完了を待機
      await uploadTask;

      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('ファイルのアップロードに失敗しました: ', error);
      throw error;
    }
  }

  // ファイルの取得
  async getFileUrl(path: string, id: string, format: FileExtension | ''): Promise<string> {
    try {
      const fileRef = ref(this.storage, `${path}/${id}.${format}`);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error('ファイルの取得に失敗しました: ', error);
      throw error;
    }
  }

  // ファイルの削除
  async deleteFile(path: string, id: string, format: FileExtension | ''): Promise<void> {
    try {
      const fileRef = ref(this.storage, `${path}/${id}.${format}`);
      await deleteObject(fileRef);
      console.log('ファイルが削除されました');
    } catch (error) {
      console.error('ファイルの削除に失敗しました: ', error);
      throw error;
    }
  }

  getObjectURL(file: File | null | undefined) {
    return file ? URL.createObjectURL(file) : "";
  }
}

export const storageManager = new StorageManager(storage);