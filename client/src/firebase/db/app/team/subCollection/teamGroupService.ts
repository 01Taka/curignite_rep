import { DocumentData, DocumentReference } from "firebase/firestore";
import ChatRoomsDB from "../../chat/chatRooms";
import { TeamGroupsDB } from "./teamGroup";
import { TeamGroupData } from "../../../../../types/firebase/db/team/teamGroupTypes";

export class TeamGroupService {
  constructor (private chatRoomsDB: ChatRoomsDB, private getTeamGroupsDBInstance: (teamId: string) => TeamGroupsDB) {}

  async createGroup(
    teamId: string,
    createdById: string,
    groupName: string,
    iconUrl: string,
    description: string = "",
  ): Promise<DocumentReference<TeamGroupData, DocumentData>> {
    try {
      const groupsDB = this.getTeamGroupsDBInstance(teamId);

      // チームグループの作成
      const groupRef = await groupsDB.createTeamGroup(createdById, groupName, iconUrl, description);

      // グループに付属するチャットルームの作成
      const chatRoomRef = await this.chatRoomsDB.createChatRoom(createdById, groupName, iconUrl, groupRef.id, "group");

      // チャットルームのIDをグループに保存
      await groupsDB.updateTeamGroup(groupRef.id, { chatroomId: chatRoomRef.id });
      
      return groupRef;
    } catch (error) {
      console.error(`Error creating group for team ${teamId}:`, error);
      throw new Error(`Failed to create group '${groupName}' for team ${teamId}. Please try again.`);
    }
  }
}