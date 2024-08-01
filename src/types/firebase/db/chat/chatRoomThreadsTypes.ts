import { BaseDocumentData } from "../baseTypes";

export type ChatThreadStatus = 'active' | 'archived' | 'deleted';

export interface ChatRoomThreadData extends BaseDocumentData {
    title: string;
    status: ChatThreadStatus;
    participantsId: string[]
}