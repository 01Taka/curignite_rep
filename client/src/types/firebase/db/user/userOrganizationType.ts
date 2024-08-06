import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../baseTypes";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";

export interface UserOrganizationData extends BaseDocumentData {
    uid: string;
    organizationId: string;
    organizationName: string;
    grade: number;
    classNumber: number;
    joinedAt: Timestamp;
}

export const initialUserOrganizationData: UserOrganizationData = {
    ...getInitialBaseDocumentData(""),
    uid: "",
    organizationId: "",
    organizationName: "",
    grade: 0,
    classNumber: 0,
    joinedAt: Timestamp.now(),
}