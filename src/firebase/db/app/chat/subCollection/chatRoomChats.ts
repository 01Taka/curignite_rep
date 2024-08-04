import { DocumentReference, DocumentSnapshot, Firestore } from "firebase/firestore";
import BaseDB from "../../../base";
import { ChatAttachment, ChatData } from "../../../../../types/firebase/db/chat/chatsTypes";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";

class ChatRoomChatsDB extends BaseDB<ChatData> {
  constructor(firestore: Firestore, roomId: string) {
    super(firestore, `chatRooms/${roomId}/chats`);
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
  async createChat(
    createdById: string,
    senderName: string,
    senderIconUrl: string,
    content: string,
    attachments: ChatAttachment[] = [],
    replyTo: string = "",
    threadId: string = ""
  ): Promise<DocumentReference<ChatData>> {
    const data: ChatData = {
      ...getInitialBaseDocumentData(createdById),
      senderName,
      senderIconUrl,
      content,
      attachments,
      status: {
        overall: 'sent', // 初期状態は'sent'とする
        memberStatus: {} // メンバーごとの状態は初期値として空のオブジェクト
      },
      replyTo,
      threadId
    };

    return this.create(data);
  }

  /**
   * 指定されたチャットルーム内のチャットメッセージを取得
   * @param messageLimit 取得するメッセージの最大数
   * @param startAfterMessageId 取得を開始するメッセージのID（オプション）
   * @returns チャットメッセージの配列
   */
  async getChatsInRoom(messageLimit?: number, startAfterMessageId?: string): Promise<ChatData[]> {
    let startSnap: DocumentSnapshot<ChatData> | undefined;

    if (startAfterMessageId) {
      try {
        startSnap = await this.readAsDocumentSnapshot(startAfterMessageId);
        if (!startSnap.exists()) {
          console.warn(`Document with ID ${startAfterMessageId} does not exist.`);
          startSnap = undefined; // ドキュメントが存在しない場合は開始位置を指定しない
        }
      } catch (error) {
        console.error("Failed to get document snapshot: ", error);
        throw new Error("Failed to get document snapshot");
      }
    }

    const chats = await this.getAllWithPagination(startSnap, messageLimit);
    return chats;
  }

  /**
   * チャットメッセージを読み取る
   * @param chatId チャットメッセージのID
   * @returns チャットメッセージのデータまたはnull
   */
  async getChat(chatId: string): Promise<ChatData | null> {
    return this.read(chatId);
  }

  /**
   * チャットメッセージを更新する
   * @param chatId チャットメッセージのID
   * @param updates 更新するデータ
   */
  async updateChat(chatId: string, updates: Partial<ChatData>): Promise<void> {
    return this.update(chatId, updates);
  }

  /**
   * チャットメッセージを削除する
   * @param chatId チャットメッセージのID
   */
  async deleteChat(chatId: string): Promise<void> {
    return this.softDelete(chatId);
  }
}

export default ChatRoomChatsDB;
