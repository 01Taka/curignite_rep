import { Firestore } from "firebase/firestore";
import JoinRequestService from "../../../common/joinRequestService";

export class SpaceJoinRequestService extends JoinRequestService {
  constructor(firestore: Firestore) {
    super(firestore, "teams");
  }

  /**
   * チームへの参加リクエストを送信する
   * @param requesterId - 参加するユーザーのID
   * @param space - チームデータ
   */
    async sendJoinRequest(spaceId: string, requesterId: string) {
      await this.createJoinRequest(spaceId, requesterId);
    }
}