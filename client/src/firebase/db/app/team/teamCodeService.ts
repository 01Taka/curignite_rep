import { DocumentData, DocumentReference } from "firebase/firestore";
import { toTimestamp } from "../../../../functions/dateTimeUtils";
import { TeamCodeData } from "../../../../types/firebase/db/team/teamCodesTypes";
import { TeamData } from "../../../../types/firebase/db/team/teamsTypes";
import { TimeTypes } from "../../../../types/util/dateTimeTypes";
import TeamCodesDB from "./teamCodes";
import TeamsDB from "./teams";

export class TeamCodeService {
    constructor(private teamCodesDB: TeamCodesDB, private teamsDB: TeamsDB) { }

    async createNewTeamCode(createdById: string, teamId: string, period?: TimeTypes): Promise<DocumentReference<DocumentData, DocumentData>> {
        try {
            const prevCode = await this.teamCodesDB.getFirstMatch("teamId", teamId);
            if (prevCode) {
                await this.teamCodesDB.updateTeamCode(prevCode.docId, { valid: false, isActive: false });
            }
    
            const newCodeRef = this.teamCodesDB.createTeamCode(createdById, teamId, period ? toTimestamp(period) : null);
            return newCodeRef;
        } catch (error) {
            // Handle the error appropriately
            console.error("Error creating new team code:", error);
            throw error;
        }
    }
    
    async getTeamCodeByTeamId(teamId: string): Promise<TeamCodeData | null> {
        try {
            const code = await this.teamCodesDB.getFirstMatch("teamId", teamId);
            return code;
        } catch (error) {
            console.error(`Failed to fetch team code for teamId: ${teamId}`, error);
            return null;
        }
    }
    

    /**
     * チームコードを検証し、対応するチームを取得する
     * @param teamCode - チームコードのID
     * @returns チームデータまたはnull
     */
    async validateTeamCode(teamCode: string): Promise<TeamData | null> {
        const teamCodeData = await this.teamCodesDB.getTeamCode(teamCode);
        if (!teamCodeData) {
            console.error(`Invalid team code: ${teamCode}`);
            return null;
        }
        const team = await this.teamsDB.getTeam(teamCodeData.teamId);
        if (!team) {
            console.error(`Team not found for team code: ${teamCode}`);
            return null;
        }
        return team;
    }
}
