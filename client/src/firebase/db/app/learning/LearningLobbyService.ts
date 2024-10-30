import { DocumentData, DocumentReference, Firestore, increment } from "firebase/firestore";
import BaseDB from "../../base";
import { LearningLobbyData } from "../../../../types/firebase/db/learning/learningStructure";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { LobbyVisibility } from "../../../../types/firebase/db/learning/learningSupplementTypes";

export class LearningLobbyService {
  private baseDB: BaseDB<LearningLobbyData>;

  constructor(firestore: Firestore) {
    firestore
    this.baseDB = new BaseDB(firestore, 'learningLobby');
  }

  async createLobby(
    creatorId: string,
    visibility: LobbyVisibility,
  ): Promise<DocumentReference<LearningLobbyData, DocumentData>> {
    const data: LearningLobbyData = {
      ...getInitialBaseDocumentData(creatorId),
      visibility,
      memberCount: 0
    }

    return await this.baseDB.create(data);
  }

  async updateMemberCount(lobbyId: string, change: number) {
    this.baseDB.update(lobbyId, { memberCount: increment(change) })

  }
}