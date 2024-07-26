import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { PublicationTarget, SpaceData } from "../../../../types/firebase/db/spacesTypes";

class SpacesDB extends BaseDB<SpaceData> {
    constructor(firestore: Firestore) {
        super(firestore, "spaces");
    }

    async createSpace(spaceName: string, introduction: string, authorUid: string, publicationTarget: PublicationTarget, requiredApproval: boolean, memberUids: string[], createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const data: SpaceData = {documentId: "", spaceName, introduction, authorUid, publicationTarget, requiredApproval, memberUids, createdAt};
        return await this.create(data); 
    }
}

export default SpacesDB;