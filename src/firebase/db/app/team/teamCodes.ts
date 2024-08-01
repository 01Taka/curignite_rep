import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { TeamCodeData } from "../../../../types/firebase/db/team/teamCodesTypes";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";

class TeamCodesDB extends BaseDB<TeamCodeData> {
    constructor(firestore: Firestore) {
        super(firestore, "teamCodes");
    }

    /**
     * 新しいチームコードを作成
     * @param createdById - 作成者のUid
     * @param teamId チームID
     * @param period 有効期限（nullの場合、無期限）
     * @param valid チームコードが有効かどうか
     * @returns 新しく作成されたチームコードのドキュメントリファレンス
     */
    async createTeamCode(createdById: string, teamId: string, period: Timestamp | null, valid: boolean = true): Promise<DocumentReference<DocumentData>> {
        const data: TeamCodeData = {
            ...getInitialBaseDocumentData(createdById),
            teamId,
            period,
            valid
        };
        return this.create(data);
    }

    /**
     * チームコードデータを取得
     * @param teamCodeId チームコードID
     * @returns チームコードデータ
     */
    async getTeamCode(teamCodeId: string): Promise<TeamCodeData | null> {
        try {
            return await this.read(teamCodeId);
        } catch (error) {
            console.error("Failed to get team code data: ", error);
            return null;
        }
    }

    /**
     * チームコードデータを更新
     * @param teamCodeId チームコードID
     * @param data 更新するデータ
     */
    async updateTeamCode(teamCodeId: string, data: Partial<TeamCodeData>): Promise<void> {
        try {
            await this.update(teamCodeId, data);
        } catch (error) {
            console.error("Failed to update team code data: ", error);
            throw new Error("Failed to update team code data");
        }
    }

    /**
     * チームコードデータを削除
     * @param teamCodeId チームコードID
     */
    async deleteTeamCode(teamCodeId: string): Promise<void> {
        try {
            await this.delete(teamCodeId);
        } catch (error) {
            console.error("Failed to delete team code data: ", error);
            throw new Error("Failed to delete team code data");
        }
    }

    /**
     * チームコードの有効性を更新
     * @param teamCodeId チームコードID
     * @param valid 新しい有効性ステータス
     */
    async updateTeamCodeValidity(teamCodeId: string, valid: boolean): Promise<void> {
        try {
            await this.updateTeamCode(teamCodeId, { valid });
        } catch (error) {
            console.error("Failed to update team code validity: ", error);
            throw new Error("Failed to update team code validity");
        }
    }

    /**
     * チームコードの有効期限を更新
     * @param teamCodeId チームコードID
     * @param period 新しい有効期限
     */
    async updateTeamCodePeriod(teamCodeId: string, period: Timestamp | null): Promise<void> {
        try {
            await this.updateTeamCode(teamCodeId, { period });
        } catch (error) {
            console.error("Failed to update team code period: ", error);
            throw new Error("Failed to update team code period");
        }
    }
}

export default TeamCodesDB;
