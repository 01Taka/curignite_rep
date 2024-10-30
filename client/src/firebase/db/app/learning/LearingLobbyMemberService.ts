import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { LearningMemberData } from "../../../../types/firebase/db/learning/learningStructure";
import { LearningLobbyService } from "./LearningLobbyService";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { LearningState } from "../../../../types/firebase/db/learning/learningSupplementTypes";

export class LearningLobbyMemberService {
  private baseDB: BaseDB<LearningMemberData> | undefined;

  constructor(private firestore: Firestore, private lobbyService: LearningLobbyService) {}

  private getBaseDB(lobbyId: string): BaseDB<LearningMemberData> {
    if (!this.baseDB || this.baseDB.getCollectionPath() !== this.getPath(lobbyId)) {
      this.baseDB = new BaseDB(this.firestore, this.getPath(lobbyId));
    }
    return this.baseDB;
  }

  private getPath(lobbyId: string): string {
    return `learningLobbies/${lobbyId}/members`;
  }

  async joinLobby(
    lobbyId: string,
    userId: string,
    state: LearningState = "study"
  ): Promise<DocumentReference<LearningMemberData, DocumentData>> {
    const memberData: LearningMemberData = {
      ...getInitialBaseDocumentData(userId),
      state,
      joinedAt: Timestamp.now(),
    };

    try {
      const result = await this.getBaseDB(lobbyId).create(memberData);
      await this.lobbyService.updateMemberCount(lobbyId, 1);
      return result;
    } catch (error) {
      console.error("Failed to join lobby:", error);
      throw error;
    }
  }

  async exitLobby(lobbyId: string, userId: string): Promise<void> {
    try {
      await this.getBaseDB(lobbyId).softDelete(userId);
      await this.lobbyService.updateMemberCount(lobbyId, -1);
    } catch (error) {
      console.error("Failed to exit lobby:", error);
      throw error;
    }
  }
}
