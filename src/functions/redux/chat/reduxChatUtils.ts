import serviceFactory from "../../../firebase/db/factory";
import { fetchChats } from "../../../redux/actions/chat/chatRoomActions";
import { clearChatRoom, setCurrentRoomId, setStartAfterMessageId } from "../../../redux/slices/chat/chatRoomSlice";
import store from "../../../redux/store";
import { ChatData, ChatIdMap } from "../../../types/firebase/db/chat/chatsTypes";
import { AppDispatch } from "../../../types/module/redux/reduxTypes";

/**
 * チャットルームのクリア、新しいチャットルームへの移動、初期メッセージのセットを行う非同期関数
 * @param dispatch Redux dispatch function
 * @param newRoomId 移動する新しいチャットルームのID
 * @param getFirstGetMessageNumber はじめに取得するチャットの数（デフォルトは30）
 */
export const moveToChatRoom = async (dispatch: AppDispatch, newRoomId: string, getFirstGetMessageNumber: number = 30): Promise<ChatIdMap | null> => {
    dispatch(clearChatRoom());
    dispatch(setCurrentRoomId(newRoomId));
    if (getFirstGetMessageNumber > 0) {
        try {
            return await getNextPageChatsByRedux(dispatch, getFirstGetMessageNumber);
        } catch (error) {
            console.error("Failed to fetch initial messages for the new chat room:", error);
        }
    }
    return null;
};

/**
 * Reduxを使用して次のページのチャットメッセージを取得します。
 * @param dispatch Redux dispatch function
 * @param messageLimit 取得するメッセージの最大数（デフォルトは50）
 * @returns 取得したチャットメッセージのマップ、またはnull
 */
const getNextPageChatsByRedux = async (dispatch: AppDispatch, messageLimit: number = 50): Promise<ChatIdMap | null> => {
    const { currentRoomId, startAfterMessageId } = store.getState().chatRoomSlice;
    if (!currentRoomId) return null;

    try {
        const messages = await fetchChatsInRoom(dispatch, currentRoomId, messageLimit, startAfterMessageId || undefined);
        const lastMessageId = getLastMessageId(messages);
        if (lastMessageId) dispatch(setStartAfterMessageId(lastMessageId));
        return messages;
    } catch (error) {
        console.error("Failed to get next page chats by Redux:", error);
        return null;
    }
};

/**
 * 指定されたメッセージのオブジェクトから最後のメッセージIDを取得します。
 * @param messages メッセージのオブジェクト
 * @returns 最後のメッセージID、またはundefined
 */
const getLastMessageId = (messages: ChatIdMap): string | undefined => {
    let lastMessage: ChatData | undefined = undefined;
    for (const message of Object.values(messages)) {
        if (!lastMessage || message.createdAt > lastMessage.createdAt) {
            lastMessage = message;
        }
    }
    return lastMessage?.docId;
};

/**
 * チャットルーム内のメッセージを取得します。
 * @param dispatch Redux dispatch function
 * @param roomId チャットルームID
 * @param messageLimit 取得するメッセージの最大数
 * @param startAfterMessageId 取得開始のメッセージID
 * @returns 取得したチャットメッセージのマップ
 */
const fetchChatsInRoom = async (dispatch: AppDispatch, roomId: string, messageLimit: number, startAfterMessageId?: string): Promise<ChatIdMap> => {
    try {
        const chatRoomChatsDB = serviceFactory.createChatRoomsChatsDB(roomId);
        await dispatch(fetchChats({ messageLimit, startAfterMessageId, chatRoomChatsDB }));
        const { messages } = store.getState().chatRoomSlice;
        return messages;
    } catch (error) {
        console.error("Failed to fetch chats:", error);
        throw new Error("Failed to fetch chats");
    }
};

export { getNextPageChatsByRedux, getLastMessageId, fetchChatsInRoom };
