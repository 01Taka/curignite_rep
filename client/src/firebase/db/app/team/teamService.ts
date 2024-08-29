import TeamsDB from "./teams";
import { TeamActionTypes, TeamData, TeamMember } from "../../../../types/firebase/db/team/teamsTypes";
import { UserTeamData, UserTeamStatus } from "../../../../types/firebase/db/user/userTeamsTypes";
import { ActionInfo, DocumentRefWithFileUrl, JoinState, Member } from "../../../../types/firebase/db/baseTypes";
import { isUserInActionInfo, isUserInMembers } from "../../../../functions/db/dbUtils";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";
import { Timestamp } from "firebase/firestore";
import { removeDuplicatesByKey } from "../../../../functions/objectUtils";
import { StorageManager } from "../../../storage/storageManager";
import { getFileExtension } from "../../../../functions/fileUtils";

export class TeamService {
    constructor (
        private teamsDB: TeamsDB,
        private storageManager: StorageManager,
    ) { }

    /**
     * チームを作成する。
     * （注意）アプリケーション内でチームを作成する場合はuserServiceのcreateTeam関数を使う
     * @param createdById 作成者のUID
     * @param teamName チーム名
     * @param iconImage チームアイコンFile
     * @param description 説明文
     * @param requiresApproval 参加に承認が必要か
     * @returns 作成されたチームのドキュメントリファレンス
     */
    async createTeam(
        createdById: string,
        teamName: string,
        iconImage: File | null,
        description: string,
        requiresApproval: boolean,
    ): Promise<DocumentRefWithFileUrl<"icon">> {
        try {
            // チームを作成
            const teamRef = await this.teamsDB.createTeam(
                createdById,
                teamName,
                "",
                description,
                requiresApproval,
            );

            let iconUrl: string | null = null;

            // アイコン画像が提供されている場合、ストレージにアップロード
            if (iconImage) {
                iconUrl = await this.uploadIconImage(teamRef.id, iconImage);
                this.teamsDB.updateTeam(teamRef.id, { iconUrl });
            }

            return { documentRef: teamRef, filesUrl: { icon: iconUrl } };
        } catch (error) {
            console.error('チームの作成に失敗しました:', error);
            throw new Error('チームの作成に失敗しました。');
        }
    }

    private async uploadIconImage(teamId: string, iconImage: File): Promise<string> {
        try {
            return await this.storageManager.uploadFile(
                this.teamsDB.getCollectionPath(),
                teamId,
                getFileExtension(iconImage.type),
                iconImage
            );
        } catch (error) {
            console.error('アイコン画像のアップロードに失敗しました:', error);
            throw new Error('アイコン画像のアップロードに失敗しました。');
        }
    }
    
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

    /**
     * 学習メンバーの配列から重複を除去します。
     * 
     * @param members - 重複を除去する対象の学習メンバーの配列。
     * @returns 重複が除去された学習メンバーの配列。
     */
    private getUniqueLearningMembers(members: ActionInfo<"learning">[]): ActionInfo<"learning">[] {
        return removeDuplicatesByKey(members, "userId");
    }

    async addLearningMember(teamId: string, userId: string): Promise<void> {
        try {
            const team = await this.teamsDB.getTeam(teamId);
            if (!team) {
                return;
            }

            // 新しいメンバーの情報を作成
            const newMember: ActionInfo<"learning"> = {
                userId,
                actionAt: Timestamp.now(),
                actionType: "learning"
            };
    
            // 既存のメンバーと新しいメンバーを統合し、重複を除去
            const updatedLearningMembers = this.getUniqueLearningMembers([...team.learningMembers, newMember]);
    
            // データベースを更新
            await this.teamsDB.update(team.docId, { learningMembers: updatedLearningMembers });
    
        } catch (error) {
            // エラーハンドリング
            console.error("Failed to add learning member:", error);
            throw new Error("Unable to add learning member. Please try again later.");
        }
    }

    async removeLearningMember(teamId: string, userId: string): Promise<void> {
        try {
            const team = await this.teamsDB.getTeam(teamId);
            if (!team) {
                return;
            }

            // team.learningMembersが存在するか確認
            if (!team.learningMembers) {
                throw new Error("team.learningMembers is undefined");
            }
    
            // フィルタリングして新しいメンバーリストを作成
            const updatedLearningMembers = team.learningMembers.filter(member => member.userId !== userId);
    
            // データベースを更新
            await this.teamsDB.update(team.docId, { learningMembers: updatedLearningMembers });
        } catch (error) {
            // エラーハンドリング
            console.error("Failed to remove learning member:", error);
            throw new Error("Unable to remove learning member. Please try again later.");
        }
    }

    async getLearningMember(teamId: string): Promise<Member[]> {
        try {
            const teamData = await this.teamsDB.getTeam(teamId);
            if (!teamData || !teamData.members || !teamData.learningMembers) {
                return []; // チームデータが存在しない場合は空
            }

            const learningMembersId = teamData.learningMembers.map(member => member.userId);
    
            // 各メンバーの学習状態をチェックするPromiseを作成し、並列実行する
            const learningMembers = teamData.members.map(member => {
                const isLearning = learningMembersId.includes(member.userId);
                return isLearning ? member : null;
            });

            const filterMember = learningMembers.filter(member => member !== null);

            // 学習中のメンバーの数を返す
            return filterMember as Member[];
        } catch (error) {
            console.error("Error counting learning members:", error);
            throw new Error("Error counting learning members.");
        }
    }

    async getLearningMemberMap(teamsId: string[]): Promise<DocumentIdMap<Member[]>> {
        try {
            const learningMembersEntries = await Promise.all(
                teamsId.map(async teamId => {
                    const members = await this.getLearningMember(teamId);
                    return [teamId, members];
                })
            );
    
            // Convert the array of tuples into an object
            return Object.fromEntries(learningMembersEntries);
        } catch (error) {
            console.error('Failed to fetch learning members map:', error);
            throw new Error('Failed to fetch learning members map');
        }
    }

    getTeamActions(team: TeamData): ActionInfo<TeamActionTypes>[] {
        return [...team.pendingRequests, ...team.rejectedUsers, ...team.invitedUsers];
    }
}
