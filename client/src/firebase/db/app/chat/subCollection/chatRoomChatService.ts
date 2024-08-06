import { DocumentReference } from "firebase/firestore";
import { ChatData, ChatAttachment } from "../../../../../types/firebase/db/chat/chatsTypes";
import ChatRoomChatsDB from "./chatRoomChats";
import { UsersDB } from "../../user/users";
import { UserData } from "../../../../../types/firebase/db/user/usersTypes";

class ChatRoomChatService {
    constructor(
        private chatsDB: ChatRoomChatsDB,
        private usersDB: UsersDB
      ) {}
    
    /**
     * チャットメッセージを送信する
     * @param senderId 送信者のID
     * @param content メッセージの内容
     * @param attachments 添付ファイルの配列
     * @param replyTo 返信対象のメッセージID
     * @param threadId スレッドID
     * @returns 作成されたメッセージのDocumentReference
     */
    async sendChat(
        senderId: string,
        content: string,
        attachments?: ChatAttachment[],
        replyTo?: string,
        threadId?: string
    ): Promise<DocumentReference<ChatData>> {
        const user = await this.verifyUser(senderId);

        return this.chatsDB.createChat(user.docId, user.username, user.iconUrl, content, attachments, replyTo, threadId);
    }

    /**
     * ファイルを送信する
     * @param senderId 送信者のID
     * @param file ファイルオブジェクト
     * @param content メッセージの内容
     * @param replyTo 返信対象のメッセージID
     * @param threadId スレッドID
     * @returns 作成されたメッセージのDocumentReference
     */
    async sendFile(
        senderId: string,
        file: File,
        content: string = '',
        replyTo?: string,
        threadId?: string
    ): Promise<DocumentReference<ChatData>> {
        const user = await this.verifyUser(senderId);

        const attachment: ChatAttachment = {
            type: 'file',
            url: await this.uploadFile(file), // ファイルをアップロードしてURLを取得
            fileName: file.name,
            fileSize: file.size,
        };

        return this.chatsDB.createChat(user.docId, user.username, user.iconUrl, content, [attachment], replyTo, threadId);
    }

    /**
     * 添付ファイルをアップロードし、URLを取得する関数
     * この関数はファイルのストレージへのアップロードをシミュレートしています。
     * 実際には、Firebase Storageなどのストレージサービスを使用する必要があります。
     * @param file アップロードするファイル
     * @returns ファイルのダウンロードURL
     */
    private async uploadFile(file: File): Promise<string> {
        // ここでファイルのアップロードロジックを実装します
        // 例: Firebase Storageにファイルをアップロードし、ダウンロードURLを取得する
        const downloadUrl = ''; // アップロード後のダウンロードURL
        return downloadUrl;
    }

    /**
     * ユーザーの存在と必要なデータが揃っているかを確認するヘルパーメソッド
     * @param userId ユーザーID
     * @returns ユーザーの詳細
     * @throws ユーザーが見つからない場合や、ユーザーの表示名またはアイコンが見つからない場合にエラーをスロー
     */
    private async verifyUser(userId: string): Promise<UserData> {
        const user = await this.usersDB.read(userId);
        if (!user) {
            throw new Error("ユーザーが見つかりませんでした。");
        }
        const { username } = user;

        if (!username) {
            throw new Error("ユーザーの表示名が見つかりません");
        }

        return user;
    }
}

export default ChatRoomChatService;
