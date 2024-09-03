import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { ChatRoomData } from "../../../../types/firebase/db/chat/chatRoomStructure";
import { ChatRoomRelationships } from "../../../../types/firebase/db/chat/chatRoomSupplementTypes";

export class ChatRoomService {
  baseDB: BaseDB<ChatRoomData>;

  constructor(fireStore: Firestore) {
      this.baseDB = new BaseDB(fireStore, "chatRooms");
  }

  /**
   * 新しいチャットルームを作成
   * @param roomName チャットルームの名前
   * @param roomIconUrl チャットルームのアイコンURL
   * @param parentId 親ID（チームやスペースのID）
   * @param parentType 親タイプ（チームやスペースなど）
   * @param members メンバーのUIDリスト
   * @param messageCount メッセージの数
   * @param lastUpdated 最終更新日時
   * @param createdAt 作成日時
   * @returns 新しく作成されたチャットルームのドキュメントリファレンス
   */
  async createChatRoom(
    createdById: string,
    roomName: string,
    relationships: ChatRoomRelationships,
  ): Promise<DocumentReference<DocumentData>> {
    const data: ChatRoomData = {
      ...getInitialBaseDocumentData(createdById),
      roomName,
      relationships,
    };
    return await this.baseDB.create(data);
  }
}