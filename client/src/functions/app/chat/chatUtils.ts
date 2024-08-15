import { ChatData } from "../../../types/firebase/db/chat/chatsTypes";
import { TimestampConvertedDocumentMap } from "../../../types/firebase/db/formatTypes";
import { revertTimestampConversion } from "../../db/dataFormatUtils";

/**
 * チャットメッセージを作成日の降順に並び替えます。
 * @param chatIdMap チャットメッセージのマップ
 * @returns ソートされたチャットメッセージの配列
 */
export const sortChatIdMap = (chatIdMap: TimestampConvertedDocumentMap<ChatData>): ChatData[] => {
    // オブジェクトのエントリを配列に変換
    const chatArray = Object.values(chatIdMap);

    // 作成日の降順にソート
    return revertTimestampConversion(chatArray.sort((a, b) => a.createdAt - b.createdAt)) || [];
};