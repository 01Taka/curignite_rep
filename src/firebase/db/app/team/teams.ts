import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { TeamData, TeamParticipants } from "../../../../types/firebase/db/teamsTypes";
import { hashDataSHA256 } from "../../../../functions/hash";

class TeamsDB extends BaseDB<TeamData> {
    constructor(firestore: Firestore) {
        super(firestore, "teams");
    }

    async createTeam(teamName: string, iconPath: string, password: string, requiredApproval: boolean, introduction: string, authorUid: string, participants: Partial<TeamParticipants>, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const fullParticipants: TeamParticipants = {
            admin: participants.admin || [],
            regularMember: participants.regularMember || [],
            invitee: participants.invitee || [],
            pending: participants.pending || [],
            rejected: participants.rejected || []
        };

        const hashedPassword = password ?  hashDataSHA256(password) : null;
        const data: TeamData = { documentId: "", teamName, iconPath, hashedPassword, requiredApproval, introduction, authorUid, participants: fullParticipants, createdAt };
        return this.create(data);
        
    }
}

export default TeamsDB;