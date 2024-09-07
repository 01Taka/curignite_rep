import { FirebaseStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { FileExtension } from "../../types/util/utilTypes";
import { getFileExtension } from "../../functions/fileUtils";

export class StorageManager {
  constructor(private storage: FirebaseStorage) { }

  async uploadFiles(path: string, id: string, startIndex: number, files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      try {
        const idWithIndex = `${id}-${startIndex + index}`;
        return await this.uploadFile(path, idWithIndex, file);
      } catch (error) {
        console.error(`ファイル${index}のアップロードに失敗しました: `, error);
        return null;
      }
    });
  
    return (await Promise.all(uploadPromises)).filter(url => url !== null) as string[];
  }
  
  // ファイルのアップロード
  async uploadFile(
    path: string,
    id: string,
    file: File,
    options: { format?: FileExtension, maxSizeMB?: number } = {}
  ): Promise<string> {
    const { format = getFileExtension(file.type), maxSizeMB = 5 } = options;
    
    // ファイルサイズの検証
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`ファイルサイズが大きすぎます。最大 ${maxSizeMB}MB です。`);
    }
  
    // ファイル拡張子の検証
    const fileExtension = getFileExtension(file.type);
    if (format && fileExtension !== format) {
      throw new Error(`指定された形式 ${format} と一致しません。`);
    }
  
    const storageRef = ref(this.storage, path);
    const fileRef = ref(storageRef, `${id}.${format}`);
  
    try {
      // アップロードタスクの実行と進行状況のトラッキング
      await new Promise<void>((resolve, reject) => {
        const uploadTask = uploadBytesResumable(fileRef, file);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error('アップロード中にエラーが発生しました: ', error);
            reject(error);
          },
          () => {
            console.log('アップロードが完了しました');
            resolve();
          }
        );
      });
  
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