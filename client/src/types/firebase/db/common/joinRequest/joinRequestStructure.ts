import { Timestamp } from "firebase/firestore";
import { BaseDocumentWrite } from "../../baseTypes";
import { JoinRequestStatus } from "./joinRequestSupplementTypes";

export interface JoinRequestData extends BaseDocumentWrite {
  status: JoinRequestStatus;
  requestedAt: Timestamp;
  responseAt?: Timestamp;
}