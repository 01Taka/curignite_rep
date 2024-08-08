import TeamsDB from "./teams";
import { TeamData, TeamMember } from "../../../../types/firebase/db/team/teamsTypes";
import { UserTeamData, UserTeamStatus } from "../../../../types/firebase/db/user/userTeamsTypes";
import { UserService } from "../user/userService";
import { JoinState, Member } from "../../../../types/firebase/db/baseTypes";
import { isUserInActionInfo, isUserInMembers } from "../../../../functions/db/dbUtils";

export class TeamService {
    constructor (
        private teamsDB: TeamsDB,
        private userService: UserService,
    ) { }
    /**
     * ユーザーのステータスが認証済みであるチームのリストをフィルタリングする
     * @param userTeamsData - ユーザーのチームデータ（省略可能）
     * @returns ステータスが認証済みのチームデータのリスト
     */
    private async filterApprovedUserTeams(userTeamsData: UserTeamData[]): Promise<UserTeamData[]> {
        try {
            return userTeamsData.filter(teamData => teamData.status === UserTeamStatus.Approved);
        } catch (error) {
            console.error("Error filtering approved user teams:", error);
            return [];
        }
    }

        /**
     * ユーザーのスペース参加状態を取得します。
     * @param userId ユーザーID
     * @param spaceId スペースID
     * @param spaceData スペースデータ（オプション）
     * @returns スペース参加状態
     */
    async getSpaceJoinState(userId: string, teamId: string, teamData?: TeamData | null): Promise<JoinState> {
        const team = teamData || await this.teamsDB.getTeam(teamId);
        if (!team) return "error";
        if (isUserInActionInfo(userId, team.rejectedUsers)) return "rejected";
        if (isUserInMembers(userId, team.members)) return "participated";
        if (isUserInActionInfo(userId, team.pendingRequests)) return "requesting";
        if (isUserInActionInfo(userId, team.approvedUsers) || isUserInActionInfo(userId, team.invitedUsers)) return "approved";
        return "noInfo";
    }

    /**
     * ユーザーの承認済みのすべてのチームを取得する
     * @param userTeams - ユーザーのチームデータ（省略可能）
     * @returns ユーザーが参加しているチームのリスト
     */
    async fetchApprovedTeamsForUser(userTeams: UserTeamData[]): Promise<TeamData[]> {
        try {
            const approvedUserTeams = await this.filterApprovedUserTeams(userTeams);
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
            console.error("Error fetching approved teams for user:", error);
            return [];
        }
    }

    /**
     * 指定したユーザーIDに属するチームをフィルタリングします。
     * @param userId - ユーザーID
     * @param teams - チームデータの配列
     * @returns 指定したユーザーIDに属するチームの配列
     */
    filterTeamsByUserId(userId: string, teams: TeamData[]): TeamData[] {
        return teams.filter(team => Array.isArray(team.members) && team.members.some(member => member.userId === userId));
    }

    /**
     * ユーザーが参加しているすべてのチームのすべてのユーザーを取得する
     * @param userTeams - 対象のユーザーのユーザーチームの一覧
     * @returns 同じチームに参加している他のユーザーとその役割
     */
    async fetchAllUsersInTeamsByUser(userTeams: UserTeamData[]): Promise<TeamMember[]> {
        try {
            const users: TeamMember[] = await Promise.all(
                userTeams.map(async (userTeam) => {
                    const team = await this.teamsDB.read(userTeam.teamId);
                    if (team) {
                        return team.members.map(member => {
                            const teamMember: TeamMember = {
                                ...member,
                                teamId: team.docId,
                            }
                            return teamMember
                        })
                    } else {
                        return [];
                    }
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
