import { DocumentData, DocumentReference, Firestore, Timestamp } from "firebase/firestore";
import BaseDB from "../../base";
import { TeamInfo, TeamRoles } from "./teamsTypes";

class TeamsDB extends BaseDB<TeamInfo> {
    constructor(firestore: Firestore) {
        super(firestore, "teams");
    }

    async createTeam(teamName: string, iconPath: string, password: string, requiredApproval: boolean, introduction: string, authorUid: string, roles: Partial<TeamRoles>, createdAt: Timestamp = Timestamp.now()): Promise<DocumentReference<DocumentData>> {
        const fullRoles: TeamRoles = {
            admin: roles.admin || [],
            member: roles.member || [],
            invitee: roles.invitee || [],
            pending: roles.pending || [],
            rejected: roles.rejected || []
        };
        const data: TeamInfo = { documentId: "", teamName, iconPath, password, requiredApproval, introduction, authorUid, roles: fullRoles, createdAt };
        return this.create(data);
        
    }
}

export default TeamsDB;