import { ConvertTimestampToNumber } from "../../../../functions/db/dbUtils";
import { ChatIdMap } from "../../../firebase/db/chat/chatsTypes";
import { AsyncThunkState } from "../asyncThunkTypes";

export interface FetchChatsParams {
    roomId: string;
    messageLimit: number;
    startAfterMessageId?: string;
}

export interface ChatRoomSliceState {
    currentRoomId: string | null;
    startAfterMessageId: string | null;
    messages: ConvertTimestampToNumber<ChatIdMap>;
    messageFetchStatus: AsyncThunkState<ConvertTimestampToNumber<ChatIdMap>>;
}
