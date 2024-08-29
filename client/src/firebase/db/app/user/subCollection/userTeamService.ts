import { UserTeamsDB } from "./userTeams";
import { UserTeamStatus } from "../../../../../types/firebase/db/user/userTeamsTypes";
import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import { TeamData } from "../../../../../types/firebase/db/team/teamsTypes";
import TeamsDB from "../../team/teams";
import { UsersDB } from "../users";
import { Member, RoleType } from "../../../../../types/firebase/db/baseTypes";
import { TeamCodeService } from "../../team/teamCodeService";
import { TeamGroupService } from "../../team/subCollection/teamGroupService";
import { TeamService } from "../../team/teamService";

export class UserTeamService {
    constructor(
        private teamsDB: TeamsDB,
        private usersDB: UsersDB,
        private teamService: TeamService,
        private teamCodeService: TeamCodeService,
        private teamGroupService: TeamGroupService,
        private getUserTeamsDBInstance: (userId: string) => UserTeamsDB,
    ) {}

    /**
     * チームを作成し、ユーザーのチームデータに追加する
     * @param uid - ユーザーID
     * @param teamName - チーム名
     * @param iconImage - チームアイコン
     * @param requiresApproval - 参加承認が必要かどうか
     * @param description - チームの紹介
     * @param createdAt - チーム作成日時（デフォルトは現在時刻）
     */
    async createTeam(
        uid: string, teamName: string, iconImage: File | null, description: string, requiresApproval: boolean
    ): Promise<DocumentReference<DocumentData>> {
        try {
            const result = await this.teamService.createTeam(uid, teamName, iconImage, description, requiresApproval);
            const newTeamId = result.documentRef.id;
            const iconUrl = result.filesUrl.icon ?? "";
            const userTeamsDB = this.getUserTeamsDBInstance(uid);
            await userTeamsDB.createUserTeam(uid, newTeamId, teamName, iconUrl, true);

            const groupRef = await this.teamGroupService.createGroup(newTeamId, uid, teamName, iconUrl);

            this.teamsDB.updateTeam(newTeamId, { wholeGroupId: groupRef.id });
            return result.documentRef;
        } catch (error) {
            console.error("Error creating team:", error);
            throw new Error("Failed to creating team");
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

    async addLearningMember(userId: string): Promise<void> {
        try {
            // すべてのチームを取得
            const teams = await this.getUserTeamsDBInstance(userId).getAllUserTeams();
            const teamsId = teams.map(team => team.docId);
    
            // すべてのチームに対して非同期処理を並行して実行
            await Promise.all(
                teamsId.map(teamId => this.teamService.addLearningMember(teamId, userId))
            );
        } catch (error) {
            console.error("Failed to add learning member to all teams:", error);
            throw new Error("Unable to add learning member to all teams. Please try again later.");
        }
    }

    async removeLearningMember(userId: string): Promise<void> {
        try {
            // すべてのチームを取得
            const teams = await this.getUserTeamsDBInstance(userId).getAllUserTeams();
            const teamsId = teams.map(team => team.docId);
    
            // すべてのチームに対して非同期処理を並行して実行
            await Promise.all(
                teamsId.map(teamId => this.teamService.removeLearningMember(teamId, userId))
            );
        } catch (error) {
            console.error("Failed to add learning member to all teams:", error);
            throw new Error("Unable to add learning member to all teams. Please try again later.");
        }
    }
}
