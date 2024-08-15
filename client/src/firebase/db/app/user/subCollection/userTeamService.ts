import { UserTeamsDB } from "./userTeams";
import { UserTeamStatus } from "../../../../../types/firebase/db/user/userTeamsTypes";
import { Timestamp } from "firebase/firestore";
import { TeamData } from "../../../../../types/firebase/db/team/teamsTypes";
import TeamsDB from "../../team/teams";
import { UsersDB } from "../users";
import { Member, RoleType } from "../../../../../types/firebase/db/baseTypes";
import { TeamCodeService } from "../../team/teamCodeService";
import { TeamGroupService } from "../../team/subCollection/teamGroupService";

export class UserTeamService {
    constructor(
        private teamsDB: TeamsDB,
        private usersDB: UsersDB,
        private teamCodeService: TeamCodeService,
        private teamGroupService: TeamGroupService,
        private getUserTeamsDBInstance: (userId: string) => UserTeamsDB,
    ) {}

    /**
     * チームを作成し、ユーザーのチームデータに追加する
     * @param uid - ユーザーID
     * @param teamName - チーム名
     * @param iconUrl - チームアイコンのURL
     * @param password - チームのパスワード
     * @param requiresApproval - 参加承認が必要かどうか
     * @param description - チームの紹介
     * @param createdAt - チーム作成日時（デフォルトは現在時刻）
     */
    async createTeam(uid: string, teamName: string, iconUrl: string, description: string, password: string, requiresApproval: boolean): Promise<void> {
        try {
            const teamRef = await this.teamsDB.createTeam(uid, teamName, iconUrl, description, password, requiresApproval);
            const newTeamId = teamRef.id;
            const userTeamsDB = this.getUserTeamsDBInstance(uid);
            await userTeamsDB.createUserTeam(uid, newTeamId, teamName, iconUrl, true);

            const groupRef = await this.teamGroupService.createGroup(newTeamId, uid, teamName, iconUrl);

            this.teamsDB.updateTeam(newTeamId, { wholeGroupId: groupRef.id });
        } catch (error) {
            console.error("Error creating team:", error);
        }
    }

    /**
     * 参加承認が必要なチームに参加リクエストを送信する
     * @param uid - ユーザーID
     * @param team - チームデータ
     */
    private async sendPendingRequest(uid: string, team: TeamData) {
        const pendingRequests = team.pendingRequests || [];
        pendingRequests.push({ userId: uid, actionAt: Timestamp.now(), actionType: "pending" });
        await this.teamsDB.updateTeam(team.docId, { pendingRequests });

        const userTeamsDB = this.getUserTeamsDBInstance(uid);
        await userTeamsDB.createUserTeam(
            uid,
            team.docId,
            team.teamName,
            team.iconPath,
            false,
            UserTeamStatus.Pending,
        );
    }

    /**
     * 承認不要なチームに参加する
     * @param uid - 参加するユーザーのID
     * @param team - チームデータ
     */
    private async joinTeam(uid: string, team: TeamData) {
        const members = team.members || [];
        const usersData = await this.usersDB.read(uid);
        if (usersData) {
            const memberData: Member = {
                userId: uid,
                username: usersData.username,
                iconUrl: usersData.iconUrl,
                role: RoleType.Member,
            };
            members.push(memberData);
            await this.teamsDB.updateTeam(team.docId, { members });
        }

        const userTeamsDB = this.getUserTeamsDBInstance(uid);
        await userTeamsDB.createUserTeam(
            uid,
            team.docId,
            team.teamName,
            team.iconPath,
            false,
            UserTeamStatus.Approved,
        );
    }

    /**
     * チームコードを使ってチームへの参加リクエストを送信する
     * @param uid - ユーザーID
     * @param teamCode - チームコード
     */
    async requestToJoinTeamByCode(uid: string, teamCode: string): Promise<void> {
        try {
            const team = await this.teamCodeService.validateTeamCode(teamCode);
            if (!team) return;

            if (team.requiresApproval) {
                await this.sendPendingRequest(uid, team);
            } else {
                await this.joinTeam(uid, team);
            }
        } catch (error) {
            console.error("Error sending request to join team:", error);
        }
    }
}
