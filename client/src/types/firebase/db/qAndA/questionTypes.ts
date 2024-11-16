import { BaseDocumentWrite } from "../baseTypes";

export interface Question extends BaseDocumentWrite{
    title: string;
    content: string;
}