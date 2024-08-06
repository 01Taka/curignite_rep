import { BaseDocumentData } from "../baseTypes";

export interface Question extends BaseDocumentData{
    title: string;
    content: string;
}