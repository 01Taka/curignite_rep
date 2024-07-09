import { DocumentData, DocumentReference, QueryConstraint, Timestamp } from "firebase/firestore";
import BaseDB, { DbData } from "../../base";

interface Team extends DbData {
    teamName: string;
    iconPath: string;
    password: string;
    requiredApproval: boolean;
    introduction: string;
    authorUid: string;
    participantsUid: string[];
    createdAt: Timestamp;
}

class TeamsDB extends BaseDB<Team> {
    constructor() {
        super("teams");
    }

    async createTeam(teamName: string, iconPath: string, password: string, requiredApproval: boolean, introduction: string, authorUid: string, participantsUid: string[], createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const data: Team = { documentId: "", teamName, iconPath, password, requiredApproval, introduction, authorUid, participantsUid, createdAt };
        return this.create(data);
    }
    
    async updateTeam(documentId: string, teamName: string, iconPath: string, password: string, requiredApproval: boolean, introduction: string, authorUid: string, participantsUid: string[], createdAt: Timestamp): Promise<void> {
        const data: Team = { documentId, teamName, iconPath, password, requiredApproval, introduction, authorUid, participantsUid, createdAt };
        return this.update(data);
    }
}

export default TeamsDB;