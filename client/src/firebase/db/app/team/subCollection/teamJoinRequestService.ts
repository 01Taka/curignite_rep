import { Firestore } from "firebase/firestore";
import JoinRequestService from "../../../common/joinRequestService";
import { UserTeamService } from "../../user/subCollection/userTeamService";
import { JoinRequestStatus } from "../../../../../types/firebase/db/common/joinRequest/joinRequestSupplementTypes";

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
        await this.userTeamService.createUserTeam(requesterId, teamId, "pending", false);
        await this.createJoinRequest(teamId, requesterId);
      }
    }

    override async updateJoinRequestStatus(docId: string, requesterId: string, status: JoinRequestStatus): Promise<void> {
      await super.updateJoinRequestStatus(docId, requesterId, status);
      await this.userTeamService.setJoinStatus(requesterId, docId, status);
    }
}