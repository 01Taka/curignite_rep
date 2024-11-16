import { BaseDocumentWrite } from "../baseTypes";

export interface Answer extends BaseDocumentWrite {
    questionId: string;
    content: string;
}
