import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";

export interface TeamCodeData extends BaseDocumentData {
    teamId: string;
    period: Timestamp | null;
    valid: boolean;
}
