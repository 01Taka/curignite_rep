import { getInitialBaseDocumentData } from "../../../../functions/db/dbUtils";
import { DocumentData, DocumentReference, Firestore } from "firebase/firestore";
import BaseDB from "../../base";
import { StorageManager } from "../../../storage/storageManager";
import { BaseMemberRole, BaseParticipationStatus } from "../../../../types/firebase/db/baseTypes";
import { UserTeamService } from "../user/subCollection/userTeamService";
import { TeamMemberService } from "./subCollection/teamMemberService";
import { TeamJoinRequestService } from "./subCollection/teamJoinRequestService";
import { ChatRoomService } from "../chat/chatRoomService";
import { TeamData, TeamWithSupplementary } from "../../../../types/firebase/db/team/teamStructure";
import { TeamCodeData } from "../../../../types/firebase/db/team/teamCodeStructure";
import { TeamCodeService } from "./teamCodeService";
import { DocumentIdMap } from "../../../../types/firebase/db/formatTypes";

export class TeamService {
  public baseDB: BaseDB<TeamData>;

  constructor(
    firestore: Firestore,
    private storageManager: StorageManager,
    private teamMemberService: TeamMemberService,
    private teamJoinRequestService: TeamJoinRequestService,
    private teamCodeService: TeamCodeService,
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
  ): Promise<DocumentReference<TeamData, DocumentData>> {
    try {
      const data: TeamData = {
        ...getInitialBaseDocumentData(userId),
        teamName,
        iconId: "",
        description,
        requiresApproval,
        chatRoomId: "",
      };

      const teamRef = await this.baseDB.create(data);

      let iconId: string | null = null;

      // アイコン画像が提供されている場合、ストレージにアップロード
      if (iconImage) {
        iconId = await this.uploadIconImage(teamRef.id, iconImage);
        await this.baseDB.update(teamRef.id, { iconId });
      }

      await this.chatRoomService.createChatRoom(userId, teamName, { parentId: teamRef.id, parentType: "team" });

      await this.teamMemberService.addMember(teamRef.id, userId, BaseMemberRole.Admin);

      return teamRef;
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

  async getTeamDataMap(teamsId: string[]): Promise<DocumentIdMap<TeamData>> {
    // 非同期操作を含むマッピングを作成
    const entries = await Promise.all(
      teamsId.map(async id => {
        const data = await this.getTeamData(id);
        return [id, data] as [string, TeamData];
      })
    );
  
    // エントリ配列からオブジェクトを作成
    return Object.fromEntries(entries);
  }  

  async addSupplementaryToTeam(team: TeamData): Promise<TeamWithSupplementary> {
    const iconUrl = await this.storageManager.getFileUrl(team.iconId);
    return { ...team, iconUrl } as TeamWithSupplementary;
  }

  async addSupplementaryToTeams(teams: TeamData[]): Promise<TeamWithSupplementary[]> {
    const addSupplementaryPromise = teams.map(async team => {
      const iconUrl = await this.storageManager.getFileUrl(team.iconId);
      return { ...team, iconUrl } as TeamWithSupplementary;
    })

    return await Promise.all(addSupplementaryPromise);
  }

  async getTeamDataWithTeamCodeId(teamCodeId: string): Promise<TeamData | null> {
    try {
      // チームコードの取得
      const code = await this.teamCodeService.getTeamCode(teamCodeId);
      if (!code) {
        console.error(`チームコード "${teamCodeId}" が見つかりません。`);
        throw new Error("チームコードが存在しません。");
      }
  
      // チームコードの検証
      const isValid = await this.teamCodeService.isValidTeamCode(code);
      if (!isValid) {
        console.error(`チームコード "${teamCodeId}" は無効です。`);
        throw new Error("チームコードが有効ではありません。");
      }
  
      // チームデータの取得
      const teamData = await this.baseDB.read(code.teamId);
      if (!teamData) {
        console.error(`チームID "${code.teamId}" に関連するデータが見つかりません。`);
      }
      return teamData;
  
    } catch (error) {
      console.error("エラーが発生しました: ", error);
      throw new Error("チームデータの取得に失敗しました。");
    }
  }
  
  async isTeamExist(teamId: string): Promise<boolean> {
    const snapshot = await this.baseDB.readAsDocumentSnapshot(teamId);
    return snapshot.exists();
  }

    /**
   * チームコードIDを使用してチームに参加する
   * - コードが有効であれば、ユーザーをチームに追加します。
   * - チームが承認を必要とする場合は、参加リクエストを送信します。
   * @param user - 参加するユーザーのデータ
   * @param teamCode - チームコードのデータ
   * @throws Error - チームコードが無効、チームが見つからない、またはリクエストの送信に失敗した場合
   */
  async handleTeamJoinWithTeamCodeId(userId: string, teamCodeId: string): Promise<void> {
    const code = await this.teamCodeService.getTeamCode(teamCodeId);
    if (!code) {
      throw new Error("チームコードが見つかりませんでした。");
    }
    await this.handleTeamJoin(userId, code);
  }

  
  async tryBecomeMember(userId: string, teamId: string): Promise<boolean> {
    try {
      const participationStatus = await this.getParticipationStatus(teamId, userId);

      console.log(participationStatus);
      
  
      switch (participationStatus) {
        case BaseParticipationStatus.Active:
          console.warn("既にメンバーです。");
          return true;
        case BaseParticipationStatus.Eligible:
          await this.teamMemberService.addMember(teamId, userId);
          return true;
        default:
          console.error("参加が許可されていません。");
          return false;
      }
    } catch (error) {
      console.error("メンバーシップの処理中にエラーが発生しました:", error);
      return false;
    }
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
      const isCodeValid = await this.teamCodeService.isValidTeamCode(teamCode);
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
   * ユーザーの承認済みのすべてのチームを取得する
   * @param userId - ユーザーID
   * @returns 承認済みのチームのリスト
   */
  async fetchApprovedTeams(userId: string): Promise<TeamData[]> {
    try {
      const userTeams = await this.userTeamService.getAllUserTeams(userId);
      const teamPromises = userTeams.map(async (userTeam) => {
        if (userTeam.status === "allowed") {
          const team = await this.getTeamData(userTeam.docId);
          if (team && await this.teamMemberService.isUserExist(team.docId, userId)) {
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

  async getParticipationStatus(teamId: string, userId: string): Promise<BaseParticipationStatus> {
    try {
      if (await this.teamMemberService.isUserExist(teamId, userId)) {
        return BaseParticipationStatus.Active;
      }

      const joinRequest = await this.teamJoinRequestService.getJoinRequest(teamId, userId);
      const joinState = joinRequest?.status;

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
