import { BaseDocumentData } from "../baseTypes";
import { Timestamp } from "firebase/firestore";

/**
 * docId - code
 */
export interface TeamCodeData extends BaseDocumentData {
  teamId: string;
  period: Timestamp | null;
  valid: boolean;
}