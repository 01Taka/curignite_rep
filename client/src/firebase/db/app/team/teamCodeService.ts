import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import { toTimestamp } from "../../../../functions/dateTimeUtils";
import { TimeTypes } from "../../../../types/util/dateTimeTypes";
import BaseDB from "../../base";
import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { TeamCodeData } from "../../../../types/firebase/db/team/teamCodeStructure";

export class TeamCodeService {
    baseDB: BaseDB<TeamCodeData>;

    constructor(firestore: Firestore) {
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
}
