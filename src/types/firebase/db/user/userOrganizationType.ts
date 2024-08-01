import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";

export interface UserOrganizationData extends BaseDocumentData {
    uid: string;
    organizationId: string;
    organizationName: string;
    grade: number;
    classNumber: number;
    joinedAt: Timestamp;
}