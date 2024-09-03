import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { spacesDB } from "../../dbs";
import { UserService } from "../user/userService";
import { ChatRoomService } from "../chat/chatRoomService";
import { SpaceMemberService } from "./subCollection/spaceMemberService";
import { SpaceJoinRequestService } from "./subCollection/spaceJoinRequestService";
import { SpaceData } from "../../../../types/firebase/db/space/spaceStructure";
import { BaseParticipationStatus } from "../../../../types/firebase/db/baseTypes";

export class SpaceService {
  public baseDB: BaseDB<SpaceData>;

  constructor(
    firestore: Firestore,
    private spaceMemberService: SpaceMemberService,
    private spaceJoinRequestService: SpaceJoinRequestService,
    private userService: UserService,
    private chatRoomService: ChatRoomService
  ) {
    this.baseDB = new BaseDB(firestore, "spaces");
  }

  async createSpace(
    createdById: string,
    spaceName: string,
    description: string,
    requiresApproval: boolean,
    chatRoomId: string
  ): Promise<DocumentReference<DocumentData, DocumentData>> {
    try {
      const data: SpaceData = {
        ...getInitialBaseDocumentData(createdById),
        spaceName,
        description,
        requiresApproval,
        chatRoomId: chatRoomId ?? ""
      };

      const spaceRef = await this.baseDB.create(data);

      const chatRoomRef = await this.chatRoomService.createChatRoom(
        createdById,
        spaceName,
        { parentId: spaceRef.id, parentType: "space" }
      );

      await spacesDB.update(spaceRef.id, { chatRoomId: chatRoomRef.id });
      await this.userService.appendSpaceId(createdById, spaceRef.id);

      return chatRoomRef;;
    } catch (error) {
      console.error("Failed to create space:", error);
      throw new Error("Failed to create space");
    }
  }

  async deleteSpace(spaceId: string) {
    try {
      await this.baseDB.softDelete(spaceId);
    } catch (error) {
      console.error("Failed to delete space:", error);
      throw new Error("Failed to delete space");
    }
  }

  async handleSpaceJoin(spaceId: string, userId: string): Promise<"joined" | "sentRequest"> {
    try {
      const space = await this.baseDB.read(spaceId);
      if (!space) {
        throw new Error("スペースが見つかりませんでした。");
      }

      if (space.requiresApproval) {
        await this.spaceJoinRequestService.sendJoinRequest(spaceId, userId);
        return "sentRequest";
      } else {
        await this.spaceMemberService.addMember(spaceId, userId);
        return "joined"
      }
    } catch (error) {
      console.error("Failed to handle space join:", error);
      throw new Error("Failed to handle space join");
    }
  }

  async getParticipationState(spaceId: string, userId: string): Promise<BaseParticipationStatus> {
    try {
      if (await this.spaceMemberService.isUserExist(spaceId, userId)) {
        return BaseParticipationStatus.Active;
      }

      const joinRequest = await this.spaceJoinRequestService.getJoinRequest(spaceId, userId);
      const joinState = joinRequest?.state;

      switch (joinState) {
        case "allowed":
          return BaseParticipationStatus.Eligible;
        case "pending":
          return BaseParticipationStatus.Pending;
        case "rejected":
          return BaseParticipationStatus.Declined;
        default:
          return BaseParticipationStatus.None;
      }
    } catch (error) {
      console.error("Failed to get participation state:", error);
      throw new Error("Failed to get participation state");
    }
  }
}
