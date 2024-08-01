import { ChatData, ChatIdMap } from "../../../types/firebase/db/chat/chatsTypes";

/**
 * チャットメッセージを作成日の降順に並び替えます。
 * @param chatIdMap チャットメッセージのマップ
 * @returns ソートされたチャットメッセージの配列
 */
export const sortChatIdMap = (chatIdMap: ChatIdMap): ChatData[] => {
    // オブジェクトのエントリを配列に変換
    const chatArray = Object.values(chatIdMap);

    // 作成日の降順にソート
    return chatArray.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};