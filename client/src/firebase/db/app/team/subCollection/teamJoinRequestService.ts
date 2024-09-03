import { Firestore } from "firebase/firestore";
import JoinRequestService from "../../../common/joinRequestService";
import { UserTeamService } from "../../user/subCollection/userTeamService";

export class TeamJoinRequestService extends JoinRequestService {
  constructor(firestore: Firestore, private userTeamService: UserTeamService) {
    super(firestore, "teams");
  }

  /**
   * チームへの参加リクエストを送信する
   * @param requesterId - 参加するユーザーのID
   * @param team - チームデータ
   */
    async sendJoinRequest(requesterId: string, teamId: string) {
      if (!await this.userTeamService.isTeamExist(requesterId, teamId)) {
        await this.userTeamService.createUserTeam(requesterId, teamId);
        await this.createJoinRequest(teamId, requesterId);
      }
    }
}