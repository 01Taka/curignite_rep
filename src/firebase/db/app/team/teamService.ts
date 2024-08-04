import { Timestamp } from "firebase/firestore";
import TeamsDB from "./teams";
import { TeamData } from "../../../../types/firebase/db/team/teamsTypes";
import { UserTeamData, UserTeamStatus } from "../../../../types/firebase/db/user/userTeamsTypes";
import { UserTeamsDB } from "../user/subCollection/userTeams";
import { UserTeamService } from "../user/subCollection/userTeamService";
import { Member, RoleType } from "../../../../types/firebase/db/baseTypes";
import { TeamCodeService } from "./teamCodeService";
import { UsersDB } from "../user/users";
import { UserService } from "../user/userService";

export class TeamService {
    constructor (
        private teamsDB: TeamsDB,
        private usersDB: UsersDB,
        private userTeamsDB: UserTeamsDB,
        private teamCodeService: TeamCodeService,
        private userService: UserService,
        private userTeamService: UserTeamService,
    ) { }

    /**
     * チームを作成し、ユーザーのチームデータに追加する
     * @param uid - ユーザーID
     * @param teamName - チーム名
     * @param iconPath - チームアイコンのURL
     * @param password - チームのパスワード
     * @param requiredApproval - 参加承認が必要かどうか
     * @param description - チームの紹介
     * @param createdAt - チーム作成日時（デフォルトは現在時刻）
     */
    async createTeam(uid: string, teamName: string, iconPath: string, description: string, password: string, requiredApproval: boolean): Promise<void> {
        try {
            const teamData = await this.teamsDB.createTeam(uid, teamName, iconPath, description, password, requiredApproval);
            await this.userTeamsDB.createUserTeam(uid, teamData.id, teamName, iconPath, true);
        } catch (error) {
            console.error("Error creating team:", error);
        }
    }

    /**
     * ユーザーの承認済みのすべてのチームを取得する
     * @param uid - ユーザーID
     * @param userTeamsData - ユーザーのチームデータ（省略可能）
     * @returns ユーザーが参加しているチームのリスト
     */
    async getApprovedTeams(userTeamsData?: UserTeamData[]): Promise<TeamData[]> {
        try {
            const approvedUserTeams = await this.userTeamService.getApprovedTeams(userTeamsData);
            const teams = await Promise.all(approvedUserTeams.map(async (userTeam) => {
                try {
                    const team = await this.teamsDB.read(userTeam.teamId);
                    return team ?? null;
                } catch (error) {
                    console.error(`Error fetching team data for teamId: ${userTeam.teamId}`, error);
                    return null;
                }
            }));
            return teams.filter(team => team !== null) as TeamData[];
        } catch (error) {
            console.error("Error fetching participating teams:", error);
            return [];
        }
    }
    
    /**
     * 参加承認が必要なチームに参加リクエストを送信する
     * @param uid - ユーザーID
     * @param team - チームデータ
     */
    private async sendPendingRequest(uid: string, team: TeamData) {
        const pendingRequests = team.pendingRequests || [];
        pendingRequests.push({ userId: uid, actionAt: Timestamp.now() });
        await this.teamsDB.updateTeam(team.docId, { pendingRequests });

        await this.userTeamsDB.createUserTeam(
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
     * @param uid - ユーザーID
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

        await this.userTeamsDB.createUserTeam(
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

    /**
     * ユーザーが参加しているすべてのチームのすべてのユーザーを取得する
     * @returns 同じチームに参加している他のユーザーとその役割
     */
    async fetchAllUsersInTeamsByUser(): Promise<Member[]> {
        try {
            const userTeams: UserTeamData[] = await this.userTeamService.getApprovedTeams();

            const users: Member[] = await Promise.all(
                userTeams.map(async (userTeam) => {
                    const team = await this.teamsDB.read(userTeam.teamId);
                    return team?.members || [];
                })
            ).then(results => results.flat());

            return users;
        } catch (error) {
            console.error("Error fetching all users in teams by user:", error);
            return [];
        }
    }

    async getLearningMember(teamId: string): Promise<Member[]> {
        try {
            const teamData = await this.teamsDB.getTeam(teamId);
            if (!teamData) {
                return []; // チームデータが存在しない場合は空
            }
    
            // 各メンバーの学習状態をチェックするPromiseを作成し、並列実行する
            const learningMembers = teamData.members.map(async member => {
                const isLearning = await this.userService.isLearning(member.userId);
                return isLearning ? member : null;
            });
    
            // すべてのチェックが完了するまで待機し、学習中のメンバーをフィルタリングする
            const learningResults = await Promise.all(learningMembers);
            const filterMember = learningResults.filter(member => member !== null);
    
            // 学習中のメンバーの数を返す
            return filterMember as Member[];
        } catch (error) {
            console.error("Error counting learning members:", error);
            throw new Error("Error counting learning members.");
        }
    }    
}
