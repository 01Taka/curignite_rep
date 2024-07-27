import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { PublicationTarget, SpaceData } from "../../../../types/firebase/db/spacesTypes";
import { usersDB } from "../../dbs";

class SpacesDB extends BaseDB<SpaceData> {
    constructor(firestore: Firestore) {
        super(firestore, "spaces");
    }

    async createSpace(spaceName: string, introduction: string, authorUid: string, publicationTarget: PublicationTarget, requiredApproval: boolean, memberUids: string[], createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const authorData = await usersDB.read(authorUid);
        if (!authorData) {
            throw new Error('uidに対応するユーザーが見つかりませんでした。')
        }
        const authorName = authorData.username;
        const data: SpaceData = {documentId: "", spaceName, introduction, authorUid, authorName, publicationTarget, requiredApproval, memberUids, createdAt};
        return await this.create(data); 
    }
}

export default SpacesDB;