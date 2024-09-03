import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { isBeforeDateTime, toTimestamp } from "../../../../functions/dateTimeUtils";
import { TimeTypes } from "../../../../types/util/dateTimeTypes";
import BaseDB from "../../base";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { TeamCodeData } from "../../../../types/firebase/db/team/teamCodeStructure";
import { TeamService } from "./teamService";

export class TeamCodeService {
    baseDB: BaseDB<TeamCodeData>;

    constructor(firestore: Firestore, private teamService: TeamService) {
        this.baseDB = new BaseDB(firestore, "teamCodes");
     }

    async createTeamCode(createdById: string, teamId: string, period?: TimeTypes): Promise<DocumentReference<DocumentData, DocumentData>> {
        try {
            const prevCode = await this.baseDB.getFirstMatch("teamId", teamId);
            if (prevCode) {
                await this.baseDB.update(prevCode.docId, { valid: false, isActive: false });
            }

            const data: TeamCodeData = {
                ...getInitialBaseDocumentData(createdById),
                teamId,
                period: period ? toTimestamp(period) : null,
                valid: true,
            };
            return this.baseDB.create(data);
        } catch (error) {
            // Handle the error appropriately
            console.error("Error creating new team code:", error);
            throw error;
        }
    }

    /**
     * チームコードデータを取得
     * @param teamCodeId チームコードID
     * @returns チームコードデータ
     */
    async getTeamCode(teamCodeId: string): Promise<TeamCodeData | null> {
        try {
            return await this.baseDB.read(teamCodeId);
        } catch (error) {
            console.error("Failed to get team code data: ", error);
            return null;
        }
    }

    
    async getTeamCodeByTeamId(teamId: string): Promise<TeamCodeData | null> {
        try {
            const code = await this.baseDB.getFirstMatch("teamId", teamId);
            return code;
        } catch (error) {
            console.error(`Failed to fetch team code for teamId: ${teamId}`, error);
            return null;
        }
    }

    async softDeleteTeamCode(teamCodeId: string): Promise<void> {
        this.baseDB.softDelete(teamCodeId);
    }

    /**
   * チームコードを確認する
   * @param teamCode - チームコード
   * @returns 正常true 問題false
   */
  async isValidTeamCode(teamCode: TeamCodeData): Promise<boolean> {
    if (!teamCode.valid) {
      console.error(`チームコード "${teamCode.code}" は無効としてマークされています。`);
      return false;
    }

    if (teamCode.period && isBeforeDateTime(new Date(), teamCode.period)) {
      console.error(`チームコード "${teamCode.code}" の使用期限が切れています。`);
      return false;
    }
    
    return true;
  }
}
