import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { ChatRoomData, ChatRoomParentType, defaultChatRoomPermissions } from "../../../../types/firebase/db/chat/chatRoomsTypes";
import { createInitialAdminMember, getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";

class ChatRoomsDB extends BaseDB<ChatRoomData> {
    constructor(firestore: Firestore) {
        super(firestore, "chatRooms");
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
        roomIconUrl: string,
        parentId: string,
        parentType: ChatRoomParentType,
    ): Promise<DocumentReference<DocumentData>> {
        const data: ChatRoomData = {
            ...getInitialBaseDocumentData(createdById),
            roomName,
            roomIconUrl,
            parentId,
            parentType,
            members: await createInitialAdminMember(createdById),
            permissions: defaultChatRoomPermissions,
            messageCount: 0,
        };
        return await this.create(data);
    }

    /**
     * チャットルームデータを取得
     * @param chatRoomId チャットルームID
     * @returns チャットルームデータ
     */
    async getChatRoom(chatRoomId: string): Promise<ChatRoomData | null> {
        try {
            return await this.read(chatRoomId);
        } catch (error) {
            console.error("Failed to get chat room data: ", error);
            return null;
        }
    }

    /**
     * チャットルームデータを更新
     * @param chatRoomId チャットルームID
     * @param data 更新するデータ
     */
    async updateChatRoom(chatRoomId: string, data: Partial<ChatRoomData>): Promise<void> {
        try {
            await this.update(chatRoomId, data);
        } catch (error) {
            console.error("Failed to update chat room data: ", error);
            throw new Error("Failed to update chat room data");
        }
    }

    /**
     * チャットルームデータを削除
     * @param chatRoomId チャットルームID
     */
    async deleteChatRoom(chatRoomId: string): Promise<void> {
        try {
            await this.softDelete(chatRoomId);
        } catch (error) {
            console.error("Failed to delete chat room data: ", error);
            throw new Error("Failed to delete chat room data");
        }
    }
}

export default ChatRoomsDB;
