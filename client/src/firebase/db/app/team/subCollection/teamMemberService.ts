import { Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../base";
import { DocumentIdMap } from "../../../../../types/firebase/db/formatTypes";

import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { UserTeamService } from "../../user/subCollection/userTeamService";
import { BaseMemberRole } from "../../../../../types/firebase/db/baseTypes";
import { TeamData, TeamMemberData } from "../../../../../types/firebase/db/team/teamStructure";

export class TeamMemberService {
  constructor(private firestore: Firestore, private userTeamService: UserTeamService) { }

  createBaseDB(teamId: string): BaseDB<TeamMemberData> {
    return new BaseDB(this.firestore, `teams/${teamId}/members`);
  }

  async createMember(
    teamId: string,
    userId: string,
    role: BaseMemberRole,
    joinedAt: Timestamp = Timestamp.now(),
  ): Promise<void> {
    try {
      const data: TeamMemberData = {
        ...getInitialBaseDocumentData(userId),
        joinedAt,
        role,
      };
      await this.createBaseDB(teamId).createWithId(userId, data);
    } catch (error) {
      console.error("Error creating team member: ", error);
      throw new Error("Failed to create team member");
    }
  }

    /**
   * 承認不要なチームに参加する
   * @param user - 参加するユーザーのデータ
   * @param team - チームデータ
   * @param role - ユーザーの役割（デフォルトは "member"）
   */
    async addMember(teamId: string, userId: string, role: BaseMemberRole = BaseMemberRole.Member) {
      if (await this.isUserExist(teamId, userId)) return;
  
      await this.createMember(teamId, userId, role);

      if (await this.userTeamService.isTeamExist(userId, teamId)) {
        await this.userTeamService.setJoinStatus(userId, teamId, "allowed");
      } else {
        await this.userTeamService.createUserTeam(
          userId,
          teamId,
        );
      }
    }
  
  async getAllMembers(teamId: string) {
    return await this.createBaseDB(teamId).getAll();
  }

  async getSameTeamMembersId(userId: string): Promise<string[]> {
    const membersMap = await this.getSameTeamMembersMap(userId);
    const ids = new Set<string>();
  
    Object.values(membersMap).forEach(members => {
      members.forEach(member => ids.add(member.docId));
    });
  
    return Array.from(ids);
  }  

  async getSameTeamMembersMap(userId: string): Promise<DocumentIdMap<TeamMemberData[]>> {
    const userTeams = await this.userTeamService.getAllUserTeams(userId);
    const teamDocIds = userTeams.map(team => team.docId);
    const membersMap = await this.getMembersMap(teamDocIds);
  
    const res: DocumentIdMap<TeamMemberData[]> = {};
    const checkUserExistPromises = Object.keys(membersMap).map(async (teamId) => {
      if (await this.isUserExist(teamId, userId)) {
        res[teamId] = membersMap[teamId];
      }
    });
  
    await Promise.all(checkUserExistPromises);
    return res;
  }

  async getMembersMap(teamIds: string[]): Promise<DocumentIdMap<TeamMemberData[]>> {
    // 各チームIDに対してメンバーの取得を行う
    const membersPromises = teamIds.map(async teamId => {
      const members = await this.createBaseDB(teamId).getAll();
      return [teamId, members] as [string, TeamMemberData[]];
    });
  
    // 全ての非同期処理が完了するのを待つ
    const membersEntries = await Promise.all(membersPromises);
  
    // Reduceを使用してDocumentIdMapを構築
    const membersMap: DocumentIdMap<TeamMemberData[]> = membersEntries.reduce((acc, [teamId, members]) => {
      if (teamId && members) {
        acc[teamId] = members;
      }
      return acc;
    }, {} as DocumentIdMap<TeamMemberData[]>);
  
    return membersMap;
  }  

  async isUserExist(teamId: string, userId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(teamId).readAsDocumentSnapshot(userId);
    return snapshot.exists()
  }

  async updateAllTeamMemberForMember(userId: string, data: Partial<TeamMemberData>) {
    try {
      const userTeams = await this.userTeamService.getAllUserTeams(userId);

      const updatePromises = userTeams.map(async userTeam => {
        // メンバーDBを更新
        return this.createBaseDB(userTeam.teamId).update(userId, data);
      });
      
      // すべての更新操作を並行して実行
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Failed to update all members:", error);
      throw new Error("Failed to update all members");
    }
  }

  filterNonMemberTeam(userId: string, teams: TeamData[]): Promise<TeamData[]> {
    const filterPromise = teams.filter(async team => {
        await this.isUserExist(team.docId, userId);
    })

    return Promise.all(filterPromise);
  }
}
