import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { SpacePublicationTarget, SpaceData } from "../../../../types/firebase/db/space/spacesTypes";

class SpacesDB extends BaseDB<SpaceData> {
    constructor(firestore: Firestore) {
        super(firestore, "spaces");
    }

    async createSpace(
        createdById: string,
        spaceName: string,
        description: string,
        publicationTarget: SpacePublicationTarget,
        requiresApproval: boolean,
        chatRoomId: string = "",
    ): Promise<DocumentReference<DocumentData>> {
        const data: SpaceData = {
            ...getInitialBaseDocumentData(createdById),
            spaceName,
            description,
            publicationTarget,
            requiresApproval,
            members: [],
            permissions: {},
            pendingRequests: [],
            invitedUsers: [],
            rejectedUsers: [],
            chatRoomId,
        };
        return await this.create(data); 
    }
}

export default SpacesDB;