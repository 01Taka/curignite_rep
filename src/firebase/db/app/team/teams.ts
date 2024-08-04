import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { defaultTeamPermissions, TeamData } from "../../../../types/firebase/db/team/teamsTypes";
import { hashDataSHA256 } from "../../../../functions/hash";
import { createInitialAdminMember, getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";

class TeamsDB extends BaseDB<TeamData> {
    constructor(firestore: Firestore) {
        super(firestore, "teams");
    }

    /**
     * 新しいチームを作成
     * @param teamName チーム名
     * @param iconPath チームのアイコンパス
     * @param description チームの紹介
     * @param password チームのパスワード (空文字の場合、ハッシュされずそのまま空文字で保存される)
     * @param requiresApproval 参加に承認が必要かどうか
     * @param createdById チームの作成者のUID
     * @returns 新しく作成されたチームのドキュメントリファレンス
     */
    async createTeam(
        createdById: string,
        teamName: string,
        iconPath: string,
        description: string,
        password: string | "",
        requiresApproval: boolean,
    ): Promise<DocumentReference<DocumentData>> {
        try {
            const hashedPassword = password ? hashDataSHA256(password) : "";
            const wholeGroupId = "グループを作成してIDを取得"
            const data: TeamData = {
                ...getInitialBaseDocumentData(createdById),
                teamName,
                iconPath,
                description,
                hashedPassword,
                requiresApproval,
                members: await createInitialAdminMember(createdById),
                permissions: defaultTeamPermissions,
                pendingRequests: [],
                invitedUsers: [],
                rejectedUsers: [],
                wholeGroupId,
            };
            return this.create(data);
        } catch (error) {
            console.error("Error creating team: ", error);
            throw new Error("Failed to create team"); // エラー発生時にカスタムエラーメッセージをスロー
        }
    }

    /**
     * チームデータを取得
     * @param teamId チームID
     * @returns チームデータ
     */
    async getTeam(teamId: string): Promise<TeamData | null> {
        try {
            return await this.read(teamId);
        } catch (error) {
            console.error("Failed to get team data: ", error);
            return null;
        }
    }

    /**
     * チームデータを更新
     * @param teamId チームID
     * @param data 更新するデータ
     */
    async updateTeam(teamId: string, data: Partial<TeamData>): Promise<void> {
        try {
            await this.update(teamId, data);
        } catch (error) {
            console.error("Failed to update team data: ", error);
            throw new Error("Failed to update team data");
        }
    }

    /**
     * チームデータを削除
     * @param teamId チームID
     */
    async deleteTeam(teamId: string): Promise<void> {
        try {
            await this.softDelete(teamId);
        } catch (error) {
            console.error("Failed to delete team data: ", error);
            throw new Error("Failed to delete team data");
        }
    }
}

export default TeamsDB;
