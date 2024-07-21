import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { TeamCode } from "../../../../types/firebase/db/teamsTypes";

class TeamCodesDB extends BaseDB<TeamCode> {
    constructor(firestore: Firestore) {
        super(firestore, "teamCodes");
    }

    async createTeamCode(teamId: string, period: Timestamp | null = null, valid: boolean = true): Promise<DocumentReference<DocumentData>> {
        const data: TeamCode = { documentId: "", teamId, period, valid };
        return this.create(data);
    }
}

export default TeamCodesDB