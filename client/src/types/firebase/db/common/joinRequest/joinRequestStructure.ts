import { Timestamp } from "firebase/firestore";
import { BaseDocumentData } from "../../baseTypes";
import { JoinRequestStatus } from "./joinRequestSupplementTypes";

export interface JoinRequestData extends BaseDocumentData {
  status: JoinRequestStatus;
  requestedAt: Timestamp;
  responseAt?: Timestamp;
}