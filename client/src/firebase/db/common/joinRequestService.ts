import { Firestore, QueryConstraint, Timestamp } from "firebase/firestore";
import { JoinRequestData } from "../../../types/firebase/db/common/joinRequest/joinRequestStructure";
import BaseDB from "../base";
import { getInitialBaseDocumentData } from "../../../functions/db/dbUtils";
import { convertTimestampsToNumbers, revertTimestampConversion } from "../../../functions/db/dataFormatUtils";
import { sortArray } from "../../../functions/objectUtils";
import { JoinRequestStatus } from "../../../types/firebase/db/common/joinRequest/joinRequestSupplementTypes";

class JoinRequestService {
  constructor(private firestore: Firestore, private path: string) {}

  createBaseDB(docId: string): BaseDB<JoinRequestData> {
    return new BaseDB(this.firestore, `${this.path}/${docId}/joinRequests`);
  }

  async createJoinRequest(
    docId: string,
    requesterId: string,
    requestedAt: Timestamp = Timestamp.now(),
    status: JoinRequestStatus = "pending",
    isStopExist: boolean = true,
  ): Promise<void> {
    try {
      if (isStopExist && await this.isExist(docId, requesterId)) return;

      const data: JoinRequestData = {
        ...getInitialBaseDocumentData(requesterId),
        status,
        requestedAt,
      };
      await this.createBaseDB(docId).createWithId(requesterId, data);
    } catch (error) {
      console.error("Error creating join request: ", error);
      throw new Error("Failed to create join request");
    }
  }

  async isExist(docId: string, requesterId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(docId).readAsDocumentSnapshot(requesterId);
    return snapshot.exists();
  }

  async getJoinRequest(docId: string, requesterId: string): Promise<JoinRequestData | null> {
    try {
      return await this.createBaseDB(docId).read(requesterId);
    } catch (error) {
      console.error("Error retrieving join request: ", error);
      return null;
    }
  }

  async getAllJoinRequests(docId: string, ...queryConstraints: QueryConstraint[]): Promise<JoinRequestData[]> {
    try {
      return await this.createBaseDB(docId).getAll(...queryConstraints);
    } catch (error) {
      console.error("Error getting all join request: ", error);
      throw new Error("Failed to get all join request");
    }
  }

  async updateJoinRequestStatus(docId: string, requesterId: string, status: JoinRequestStatus) {
    try {
      await this.createBaseDB(docId).update(requesterId, { status, responseAt: Timestamp.now() });
    } catch (error) {
      console.error("Error updating request status: ", error);
      throw new Error("Failed to update request status");
    }
  }    

  async softDeleteJoinRequest(docId: string, requesterId: string): Promise<void> {
    try {
      await this.createBaseDB(docId).softDelete(requesterId);
    } catch (error) {
      console.error("Error soft deleting join request: ", error);
      throw new Error("Failed to soft delete join request");
    }
  }

  async hardDeleteJoinRequest(docId: string, requesterId: string): Promise<void> {
    try {
      await this.createBaseDB(docId).hardDelete(requesterId);
    } catch (error) {
      console.error("Error hard deleting join request: ", error);
      throw new Error("Failed to hard delete join request");
    }
  }

  static sortJoinRequestsByRequestedAt(joinRequests: JoinRequestData[]): JoinRequestData[] {
    return revertTimestampConversion(sortArray(convertTimestampsToNumbers(joinRequests), "requestedAt"));
  }
}

export default JoinRequestService;
