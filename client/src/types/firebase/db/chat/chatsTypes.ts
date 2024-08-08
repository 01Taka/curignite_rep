import { BaseDocumentData } from "../baseTypes";

export type AttachmentsType = 'image' | 'video' | 'file' | 'link';
export type ChatStatusType = 'sent' | 'delivered' | 'read' | 'failed' | 'error';

export interface ChatAttachment {
    type: AttachmentsType;
    url: string;
    fileName: string;
    fileSize: number | null;
}

export interface ChatFormData {
    content: string;
    attachments?: ChatAttachment[];
}

export interface ChatData extends BaseDocumentData {
    senderName: string;
    senderIconUrl: string;
    content: string;
    attachments: ChatAttachment[];
    status: {
        overall: ChatStatusType; // 全体の状態
        memberStatus: { [memberId: string]: ChatStatusType }; // メンバーごとの状態
    };
    replyTo: string; // 返信対象のメッセージID、返信がない場合は省略される
    threadId: string; // スレッドID、スレッドがない場合は省略される
}
