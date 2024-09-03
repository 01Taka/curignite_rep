import { getInitialBaseDocumentData, isDocumentExist } from "../../../../functions/db/dbUtils";
import { Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { StorageManager } from "../../../storage/storageManager";
import { getFileExtension } from "../../../../functions/fileUtils";
import { BaseMemberRole, BaseParticipationStatus, DocumentRefWithFileUrl } from "../../../../types/firebase/db/baseTypes";
import { isBeforeDateTime } from "../../../../functions/dateTimeUtils";
import { UserTeamService } from "../user/subCollection/userTeamService";
import { TeamMemberService } from "./subCollection/teamMemberService";
import { TeamJoinRequestService } from "./subCollection/teamJoinRequestService";
import { ChatRoomService } from "../chat/chatRoomService";
import { TeamData } from "../../../../types/firebase/db/team/teamStructure";
import { TeamCodeData } from "../../../../types/firebase/db/team/teamCodeStructure";

export class TeamService {
  public baseDB: BaseDB<TeamData>;

  constructor(
    firestore: Firestore,
    private storageManager: StorageManager,
    private teamMemberService: TeamMemberService,
    private teamJoinRequestService: TeamJoinRequestService,
    private userTeamService: UserTeamService,
    private chatRoomService: ChatRoomService,
  ) {
    this.baseDB = new BaseDB(firestore, "teams");
  }

  /**
   * 新しいチームを作成。（注意）アプリケーションで使う場合、serviceから作成
   * @param teamName チーム名
   * @param iconPath チームのアイコンパス
   * @param description チームの紹介
   * @param password チームのパスワード (空文字の場合、ハッシュされずそのまま空文字で保存される)
   * @param requiresApproval 参加に承認が必要かどうか
   * @param createdById チームの作成者のUID
   * @returns 新しく作成されたチームのドキュメントリファレンス
   */
  async createTeam(
    userId: string,
    teamName: string,
    iconImage: File | null,
    description: string,
    requiresApproval: boolean,
  ): Promise<DocumentRefWithFileUrl<"icon">> {
    try {
      const data: TeamData = {
        ...getInitialBaseDocumentData(userId),
        teamName,
        iconUrl: "",
        description,
        requiresApproval,
        chatRoomId: "",
      };

      const teamRef = await this.baseDB.create(data);

      let iconUrl: string | null = null;

      // アイコン画像が提供されている場合、ストレージにアップロード
      if (iconImage) {
        iconUrl = await this.uploadIconImage(teamRef.id, iconImage);
        await this.baseDB.update(teamRef.id, { iconUrl });
      }

      await this.chatRoomService.createChatRoom(userId, teamName, iconUrl ?? "", { parentId: teamRef.id, parentType: "team" });

      await this.teamMemberService.addMember(teamRef.id, userId, BaseMemberRole.Admin);

      return { documentRef: teamRef, filesUrl: { icon: iconUrl } };
    } catch (error) {
      console.error("Failed to create team:", error);
      throw new Error("Failed to create team");
    }
  }

  private async uploadIconImage(teamId: string, iconImage: File): Promise<string> {
    try {
      return await this.storageManager.uploadFile(
        this.baseDB.getCollectionPath(),
        teamId,
        getFileExtension(iconImage.type),
        iconImage
      );
    } catch (error) {
      console.error("Failed to upload icon image:", error);
      throw new Error("Failed to upload icon image");
    }
  }

  async getTeamData(teamId: string): Promise<TeamData | null> {
    return this.baseDB.read(teamId);
  }

  async isTeamExist(teamId: string): Promise<boolean> {
    const snapshot = await this.baseDB.readAsDocumentSnapshot(teamId);
    return snapshot.exists();
  }

  /**
   * チームコードを使用してチームに参加する
   * - コードが有効であれば、ユーザーをチームに追加します。
   * - チームが承認を必要とする場合は、参加リクエストを送信します。
   * @param user - 参加するユーザーのデータ
   * @param teamCode - チームコードのデータ
   * @throws Error - チームコードが無効、チームが見つからない、またはリクエストの送信に失敗した場合
   */
  async handleTeamJoin(userId: string, teamCode: TeamCodeData): Promise<void> {
    try {
      const isCodeValid = await this.isValidCode(teamCode);
      if (!isCodeValid) {
        throw new Error(`チームコード "${teamCode.code}" は無効です。`);
      }

      const team = await this.getTeamData(teamCode.teamId);
      if (!team) {
        throw new Error(`チームID "${teamCode.teamId}" に対応するチームが見つかりません。`);
      }

      if (team.requiresApproval) {
        await this.teamJoinRequestService.sendJoinRequest(userId, team.docId);
      } else {
        await this.teamMemberService.addMember(team.docId, userId);
      }
    } catch (error) {
      console.error("チームへの参加処理中にエラーが発生しました:", error);
      throw new Error("チームへの参加リクエストの送信に失敗しました。");
    }
  }

  /**
   * チームコードを確認する
   * @param teamCode - チームコード
   * @returns 正常true 問題false
   */
  private async isValidCode(teamCode: TeamCodeData): Promise<boolean> {
    if (!teamCode.valid) {
      console.error(`チームコード "${teamCode.code}" は無効としてマークされています。`);
      return false;
    }

    if (teamCode.period && isBeforeDateTime(new Date(), teamCode.period)) {
      console.error(`チームコード "${teamCode.code}" の使用期限が切れています。`);
      return false;
    }

    if (!await this.isTeamExist(teamCode.teamId)) {
      console.error(`チームコード "${teamCode.code}" に関連するチームが見つかりません。`);
      return false;
    }

    return true;
  }

  /**
   * ユーザーの承認済みのすべてのチームを取得する
   * @param userId - ユーザーID
   * @returns 承認済みのチームのリスト
   */
  async fetchApprovedTeams(userId: string): Promise<TeamData[]> {
    const userTeams = await this.userTeamService.getAllUserTeams(userId);
    try {
      const teamPromises = userTeams.map(async (userTeam) => {
        if (userTeam.joinStatus === "allowed") {
          const team = await this.getTeamData(userTeam.teamId);
          if (team && isDocumentExist(userId, team.members)) {
            return team;
          }
        }
        return null;
      });

      const teams = (await Promise.all(teamPromises)).filter((team): team is TeamData => team !== null);

      return teams;
    } catch (error) {
      console.error("ユーザーの承認済みチームの取得中にエラーが発生しました:", error);
      return [];
    }
  }

  async getParticipationState(teamId: string, userId: string): Promise<BaseParticipationStatus> {
    try {
      if (await this.teamMemberService.isUserExist(teamId, userId)) {
        return BaseParticipationStatus.Active;
      }

      const joinRequest = await this.teamJoinRequestService.getJoinRequest(teamId, userId);
      const joinState = joinRequest?.state;

      switch (joinState) {
        case "allowed":
          return BaseParticipationStatus.Eligible;
        case "pending":
          return BaseParticipationStatus.Pending;
        case "rejected":
          return BaseParticipationStatus.Declined;
        default:
          return BaseParticipationStatus.None;
      }
    } catch (error) {
      console.error("Failed to get participation state:", error);
      throw new Error("Failed to get participation state");
    }
  }
}
