import { DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../../base";
import { UserTeamData, UserTeamStatus } from "../../../../../types/firebase/db/user/userTeamsTypes";
import { getInitialBaseDocumentData } from "../../../../../functions/db/dbUtils";
import { RoleType } from "../../../../../types/firebase/db/baseTypes";

class UserTeamsDB extends BaseDB<UserTeamData> {
  constructor(firestore: Firestore, userId: string) {
    super(firestore, `users/${userId}/teams`);
  }

  async createUserTeam(
    createdById: string,
    teamId: string,
    teamName: string,
    teamIconUrl: string,
    myTeam: boolean,
    status: UserTeamStatus = myTeam ? UserTeamStatus.Approved : UserTeamStatus.Pending,
    role: RoleType | undefined = myTeam ? RoleType.Admin : undefined,
  ): Promise<DocumentReference<UserTeamData>> {
    const data: UserTeamData = {
      ...getInitialBaseDocumentData(createdById),
      teamId,
      teamName,
      teamIconUrl,
      myTeam,
      status,
      role,
    }
    return this.create(data);
  }

  async getAllUserTeams(): Promise<UserTeamData[]> {
    try {
      return this.getAll();
    } catch (error) {
      throw new Error("Failed to get all user teams");
    }
  }

  async getByTeamId(teamId: string): Promise<UserTeamData | null> {
    return this.getFirstMatch("teamId", teamId);
  }
}
  
export { UserTeamsDB };