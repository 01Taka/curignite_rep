import { Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../../base";
import { DocumentIdMap } from "../../../../../types/firebase/db/formatTypes";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { UserTeamService } from "../../user/subCollection/userTeamService";
import { BaseMemberRole } from "../../../../../types/firebase/db/baseTypes";
import { TeamData, TeamMemberData } from "../../../../../types/firebase/db/team/teamStructure";
import { JoinRequestStatus } from "../../../../../types/firebase/db/common/joinRequest/joinRequestSupplementTypes";

export class TeamMemberService {
  constructor(private firestore: Firestore, private userTeamService: UserTeamService) { }

  private createBaseDB(teamId: string): BaseDB<TeamMemberData> {
    return new BaseDB(this.firestore, `teams/${teamId}/members`);
  }

  async createMember(
    teamId: string,
    userId: string,
    role: BaseMemberRole,
    joinedAt: Timestamp = Timestamp.now()
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

  async addMember(
    teamId: string,
    userId: string,
    role: BaseMemberRole = BaseMemberRole.Member,
  ): Promise<void> {
    try {
      if (await this.isUserExist(teamId, userId)) return;
      await this.createMember(teamId, userId, role);

      if (await this.userTeamService.isTeamExist(userId, teamId)) {
        await this.userTeamService.updateAsMember(userId, teamId);
      } else {
        await this.userTeamService.createUserTeam(userId, teamId, "allowed", false);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      throw new Error("Failed to add member");
    }
  }
  
  async getMember(teamId: string, memberId: string) {
    return await this.createBaseDB(teamId).read(memberId);
  }

  async getAllMembers(teamId: string): Promise<TeamMemberData[]> {
    return await this.createBaseDB(teamId).getAll();
  }

  async getSameTeamMembersId(userId: string): Promise<string[]> {
    const membersMap = await this.getSameTeamMembersMap(userId);
    const ids = new Set<string>();

    Object.values(membersMap).forEach((members) =>
      members.forEach((member) => ids.add(member.docId))
    );

    return Array.from(ids);
  }

  async getSameTeamMembersMap(userId: string): Promise<DocumentIdMap<TeamMemberData[]>> {
    const userTeams = await this.userTeamService.getAllUserTeams(userId);
    const teamDocIds = userTeams.map((team) => team.docId);
    const membersMap = await this.getMembersMap(teamDocIds);

    const res: DocumentIdMap<TeamMemberData[]> = {};
    await Promise.all(
      Object.keys(membersMap).map(async (teamId) => {
        if (await this.isUserExist(teamId, userId)) {
          res[teamId] = membersMap[teamId];
        }
      })
    );

    return res;
  }

  private async getMembersMap(
    teamIds: string[]
  ): Promise<DocumentIdMap<TeamMemberData[]>> {
    const membersEntries = await Promise.all(
      teamIds.map(async (teamId) => [
        teamId,
        await this.createBaseDB(teamId).getAll(),
      ])
    );

    return membersEntries.reduce((acc, [teamId, members]) => {
      if (teamId && typeof teamId === "string" && members) {
        acc[teamId] = members as TeamMemberData[];
      }
      return acc;
    }, {} as DocumentIdMap<TeamMemberData[]>);
  }

  async isUserExist(teamId: string, userId: string): Promise<boolean> {
    const snapshot = await this.createBaseDB(teamId).readAsDocumentSnapshot(userId);
    return snapshot.exists();
  }

  async filterNonMemberTeam(
    userId: string,
    teams: TeamData[]
  ): Promise<TeamData[]> {
    const filteredTeams: TeamData[] = [];
    await Promise.all(
      teams.map(async (team) => {
        if (await this.isUserExist(team.docId, userId)) {
          filteredTeams.push(team);
        }
      })
    );
    return filteredTeams;
  }
}
