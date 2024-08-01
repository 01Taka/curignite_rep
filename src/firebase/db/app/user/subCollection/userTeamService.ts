import { UserTeamsDB } from "./userTeams";
import { UserTeamData, UserTeamStatus } from "../../../../../types/firebase/db/user/userTeamsTypes";
import { Firestore } from "firebase/firestore";

export class UserTeamService {
    private userTeamsDB: UserTeamsDB;

    constructor(firestore: Firestore, userId: string) {
        this.userTeamsDB = new UserTeamsDB(firestore, userId);
    }

    /**
     * ユーザーのステータスが認証済みであるチームのリストを取得する
     * @param userTeamsData - ユーザーのチームデータ（省略可能）
     * @returns ステータスが認証済みのチームデータのリスト
     */
    async getApprovedTeams(userTeamsData?: UserTeamData[]): Promise<UserTeamData[]> {
        try {
            const teamsData = userTeamsData ?? await this.userTeamsDB.getAll();
            return teamsData.filter(teamData => teamData.status === UserTeamStatus.Approved);
        } catch (error) {
            console.error("Error fetching approved teams:", error);
            return [];
        }
    }

}
