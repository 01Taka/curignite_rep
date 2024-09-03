import {
  DocumentReference,
  DocumentSnapshot,
  Firestore
} from 'firebase/firestore';
import BaseDB from '../../../base';
import { getInitialBaseDocumentData } from '../../../../../functions/db/dbUtils';
import { StorageManager } from '../../../../storage/storageManager';
import { getFileExtension } from '../../../../../functions/fileUtils';
import { ChatData } from '../../../../../types/firebase/db/chat/chatRoomStructure';

export class ChatRoomChatService {
  constructor(
    private firestore: Firestore,
    private storageManager: StorageManager,
  ) {}

  private createPath(chatRoomId: string): string {
    return `chatRooms/${chatRoomId}/chats`;
  }

  private createBaseDB(chatRoomId: string): BaseDB<ChatData> {
    return new BaseDB(this.firestore, this.createPath(chatRoomId));
  }

  /**
   * チャットメッセージを作成する
   * @param senderId メッセージの送信者ID
   * @param senderName メッセージの送信者名
   * @param senderIconUrl メッセージの送信者アイコンURL
   * @param content メッセージの内容
   * @param attachments 添付ファイルの配列
   * @param replyTo 返信対象のメッセージID
   * @param threadId スレッドID
   * @returns 作成されたメッセージのDocumentReference
   */
  async sendChat(
    roomId: string,
    senderId: string,
    content: string,
    files: File[] = [],
    replyTo: string = '',
  ): Promise<DocumentReference<ChatData>> {
    const baseDB = this.createBaseDB(roomId);
    const data: ChatData = {
      ...getInitialBaseDocumentData(senderId),
      content,
      fileUrls: [],
      status: {
        overall: 'sent', // 初期状態は'sent'とする
        memberStatus: {} // メンバーごとの状態は初期値として空のオブジェクト
      },
      replyTo,
    };

    const chatRef = await baseDB.create(data);

    if (files.length > 0) {
      const urls = await this.saveFiles(roomId, chatRef.id, files);
      await baseDB.update(chatRef.id, { fileUrls: urls });
    }

    return chatRef;
  }

  private async saveFiles(
    roomId: string,
    chatId: string,
    files: File[]
  ): Promise<string[]> {
    const savePromises = files.map(async file => await this.saveFile(roomId, chatId, file));
    return Promise.all(savePromises);
  }

  private async saveFile(
    roomId: string,
    chatId: string,
    file: File
  ): Promise<string> {
    return this.storageManager.uploadFile(
      this.createPath(roomId),
      chatId,
      getFileExtension(file.type),
      file
    );
  }

  /**
   * 指定されたチャットルーム内のチャットメッセージを取得
   * @param messageLimit 取得するメッセージの最大数
   * @param startAfterMessageId 取得を開始するメッセージのID（オプション）
   * @returns チャットメッセージの配列
   */
  async getChatsInRoom(
    roomId: string,
    messageLimit?: number,
    startAfterMessageId?: string
  ): Promise<ChatData[]> {
    const baseDB = this.createBaseDB(roomId);
    let startSnap: DocumentSnapshot<ChatData> | undefined;

    if (startAfterMessageId) {
      try {
        startSnap = await baseDB.readAsDocumentSnapshot(startAfterMessageId);
        if (!startSnap.exists()) {
          console.warn(`Document with ID ${startAfterMessageId} does not exist.`);
          startSnap = undefined;
        }
      } catch (error) {
        console.error('Failed to get document snapshot: ', error);
        throw new Error('Failed to get document snapshot');
      }
    }

    return baseDB.getAllWithPagination(startSnap, messageLimit);
  }
}
