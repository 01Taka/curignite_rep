import TeamCodesDB from "./teamCodes";
import TeamsDB from "./teams";

export class TeamCodeService {
    constructor(private teamCodesDB: TeamCodesDB, private teamsDB: TeamsDB) { }

    /**
     * チームコードを検証し、対応するチームを取得する
     * @param teamCode - チームコード
     * @returns チームデータまたはnull
     */
    async validateTeamCode(teamCode: string) {
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
