import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { createInitialAdminMember, getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { defaultSpacePermissions, SpaceData, SpacePublicationTarget } from "../../../../types/firebase/db/space/spacesTypes";

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
            members: await createInitialAdminMember(createdById),
            permissions: defaultSpacePermissions,
            pendingRequests: [],
            approvedUsers: [],
            invitedUsers: [],
            rejectedUsers: [],
            chatRoomId,
        };
        return await this.create(data); 
    }

    async getSpace(spaceId: string): Promise<SpaceData | null> {
        try {
            return await this.read(spaceId);
        } catch (error) {
            console.error("Failed to get space data: ", error);
            return null;
        }
    }

    async updateSpace(spaceId: string, data: Partial<SpaceData>): Promise<void> {
        try {
            await this.update(spaceId, data);
        } catch (error) {
            console.error("Failed to update space data: ", error);
            throw new Error("Failed to update space data");
        }
    }

    addSpaceCollectionCallback(callback: (data: SpaceData[]) => void): void {
        this.addCollectionCallback(callback);
    }
}

export default SpacesDB;