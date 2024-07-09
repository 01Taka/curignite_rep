import { DocumentData, DocumentReference } from "firebase/firestore";
import BaseDB, { DbData } from "../../base";

export interface TeamCode extends DbData {
    teamId: string;
}

class TeamCodesDB extends BaseDB<TeamCode> {
    constructor() {
        super("teamCodes");
    }

    async createTeamCode(teamId: string): Promise<DocumentReference<DocumentData>> {
        const data: TeamCode = { documentId: "", teamId };
        return this.create(data);
    }
    
    async updateTeamCode(documentId: string, teamId: string): Promise<void> {
        const data: TeamCode = { documentId, teamId };
        return this.update(data);
    }
}

export default TeamCodesDB