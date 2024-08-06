import { BaseDocumentData } from "../baseTypes";

export interface Answer extends BaseDocumentData {
    questionId: string;
    content: string;
}
