import { DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../../base";
import { ChatRoomThreadData } from "../../../../../types/firebase/db/chat/chatRoomThreadsTypes";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";

class ChatRoomThreadDB extends BaseDB<ChatRoomThreadData> {
  constructor(firestore: Firestore, roomId: string) {
    super(firestore, `chatRooms/${roomId}/threads`);
  }

  async createThread(createdById: string, title: string,): Promise<DocumentReference<ChatRoomThreadData>> {
    const data: ChatRoomThreadData = {
      ...getInitialBaseDocumentData(createdById),
      title,
      status: "active",
      participantsId: [],
    }
    return await this.create(data);
  }

  /**
   * スレッドを読み取る
   * @param threadId スレッドのID
   * @returns スレッドのデータ
   */
  async getThread(threadId: string): Promise<ChatRoomThreadData | null> {
    try {
      return await this.read(threadId);
    } catch (error) {
      console.error("Failed to get thread:", error);
      throw new Error("Could not retrieve the thread data.");
    }
  }

  /**
   * スレッドを更新する
   * @param threadId スレッドのID
   * @param updates 更新するデータ
   */
  async updateThread(threadId: string, updates: Partial<ChatRoomThreadData>): Promise<void> {
    try {
      await this.update(threadId, updates);
    } catch (error) {
      console.error("Failed to update thread:", error);
      throw new Error("Could not update the thread.");
    }
  }

  /**
   * スレッドを削除する
   * @param threadId スレッドのID
   */
  async deleteThread(threadId: string): Promise<void> {
    try {
      await this.softDelete(threadId);
    } catch (error) {
      console.error("Failed to delete thread:", error);
      throw new Error("Could not delete the thread.");
    }
  }
}

export default ChatRoomThreadDB;
