import { Timestamp } from "firebase/firestore";
import { isUserInActionInfo, isUserInMembers } from "../../../../functions/db/dbUtils";
import { uniqueByProperty } from "../../../../functions/utils";
import ChatRoomsDB from "../chat/chatRooms";
import { TeamService } from "../team/teamService";
import { UsersDB } from "../user/users";
import { UserService } from "../user/userService";
import SpacesDB from "./spaces";
import { SpaceData, SpacePublicationTarget, UserSpaceIds } from "../../../../types/firebase/db/space/spacesTypes";
import { ActionInfo, JoinState, Member, RoleType } from "../../../../types/firebase/db/baseTypes";
import { UserTeamsDB } from "../user/subCollection/userTeams";

export class SpaceService {
    constructor(
        private spacesDB: SpacesDB,
        private usersDB: UsersDB,
        private chatRoomsDB: ChatRoomsDB,
        private userService: UserService,
        private teamService: TeamService,
        private getUserTeamsInstance: (userId: string) => UserTeamsDB,
    ) { }

    /**
     * 新しいスペースを作成し、必要な情報を設定します。
     * @param createdById スペースを作成したユーザーのID
     * @param spaceName スペースの名前
     * @param description スペースの説明
     * @param publicationTarget スペースの公開対象
     * @param requiresApproval スペースへの参加に承認が必要かどうか
     * @throws エラーが発生した場合、エラーメッセージをスローします
     */
    async createSpace(
        createdById: string,
        spaceName: string,
        description: string,
        publicationTarget: SpacePublicationTarget,
        requiresApproval: boolean
    ) {
        try {
            const spaceRef = await this.spacesDB.createSpace(createdById, spaceName, description, publicationTarget, requiresApproval);
            const newSpaceId = spaceRef.id;
            const user = await this.usersDB.read(createdById);
            if (!user) {
                throw new Error(`User with ID ${createdById} not found.`);
            }
            const chatRoomRef = await this.chatRoomsDB.createChatRoom(createdById, spaceName, user.iconUrl, newSpaceId, "space");
            await this.spacesDB.update(newSpaceId, { chatRoomId: chatRoomRef.id });
            await this.userService.appendSpaceIdToUserData(user, newSpaceId);
        } catch (error) {
            console.error("Error creating space:", error);
            throw new Error("Failed to create space.");
        }
    }

    /**
     * 同じチームに参加しているメンバーのユーザーIDとスペースIDを取得します。
     * @param userId - 参照するユーザーのId
     * @returns メンバーのユーザーIDとスペースIDのリスト
     */
    async getSameTeamMembersSpaceIds(userId: string): Promise<UserSpaceIds[]> {
        try {
            const userTeamsDB = this.getUserTeamsInstance(userId);
            const userTeams = await userTeamsDB.getAllUserTeams();
            if (!userTeams) {
                console.error("ユーザーチームが取得できませんでした。");
                return [];
            }
            const members = await this.teamService.fetchAllUsersInTeamsByUser(userTeams);
            const uniqueMembers = uniqueByProperty(members, "userId");
            const membersSpaceIds: (UserSpaceIds | null)[] = await Promise.all(uniqueMembers.map(async (member) => {
                const memberData = await this.usersDB.read(member.userId);
                return memberData ? { userId: memberData.docId, spaceIds: memberData.spaceIds } : null;
            }));
            return membersSpaceIds.filter(item => item !== null) as UserSpaceIds[];
        } catch (error) {
            console.error("Error getting same team members' space IDs:", error);
            return [];
        }
    }

    /**
     * ユーザーのスペースIDリストに基づいてスペースデータを取得します。
     * @param userSpaceIds ユーザーのスペースIDリスト
     * @returns スペースデータのリスト
     */
    async getSpaceDataByUserSpaceIds(userSpaceIds: UserSpaceIds[]): Promise<SpaceData[]> {
        try {
            const spaceIds = userSpaceIds.flatMap(data => data.spaceIds);
            const spacePromises = spaceIds.map(id => this.spacesDB.read(id));
            const spaces = await Promise.all(spacePromises);
            return spaces.filter(space => space !== null) as SpaceData[];
        } catch (error) {
            console.error("Failed to get space data:", error);
            return [];
        }
    }

    /**
     * 同じチームに参加しているメンバーのスペースデータを取得します。
     * @param userId - 参照するユーザーのId
     * @returns メンバーのスペースデータのリスト
     */
    async getSameTeamMembersSpaceData(userId: string): Promise<SpaceData[]> {
        try {
            const userSpaceIds = await this.getSameTeamMembersSpaceIds(userId);
            if (userSpaceIds.length === 0) {
                console.error("同じチームに参加しているメンバーのスペースIDが取得できませんでした。");
                return [];
            }
            return await this.getSpaceDataByUserSpaceIds(userSpaceIds);
        } catch (error) {
            console.error("Error getting same team members' space data:", error);
            return [];
        }
    }

    /**
     * 必要に応じてスペースデータを取得します。
     * @param spaceId スペースID
     * @param spaceData スペースデータ（オプション）
     * @returns スペースデータ
     */
    private async fetchSpaceIfNeeded(spaceId: string, spaceData?: SpaceData | null): Promise<SpaceData | null> {
        return spaceData ?? await this.spacesDB.getSpace(spaceId);
    }

    /**
     * ユーザーをスペースのメンバーに追加します。
     * @param userId ユーザーID
     * @param space スペースデータ
     */
    private async addUserToMembers(userId: string, space: SpaceData): Promise<void> {
        const user = await this.usersDB.getUser(userId);
        if (user) {
            const member: Member = {
                userId,
                username: user.username,
                iconUrl: user.iconUrl,
                role: RoleType.Member,
            };
            await this.spacesDB.updateSpace(space.docId, { members: [...space.members, member] });
        }
    }

    /**
     * ユーザーをスペースに追加します。
     * @param userId ユーザーID
     * @param spaceId スペースID
     * @param spaceData スペースデータ（オプション）
     */
    async joinSpace(userId: string, spaceId: string, spaceData?: SpaceData | null): Promise<void> {
        const space = await this.fetchSpaceIfNeeded(spaceId, spaceData);
        if (!space) return;
        if (!isUserInMembers(userId, space.members)) {
            await this.addUserToMembers(userId, space);
        }
    }

    /**
     * スペース参加リクエストを処理します。
     * @param requesterId リクエストしたユーザーID
     * @param spaceId スペースID
     * @param spaceData スペースデータ（オプション）
     */
    async joinSpaceRequest(requesterId: string, spaceId: string, spaceData?: SpaceData | null): Promise<void> {
        const space = await this.fetchSpaceIfNeeded(spaceId, spaceData);
        if (!space || !space.approvedUsers || !space.invitedUsers || !space.pendingRequests) return;
        const actionInfoList = [...space.invitedUsers, ...space.approvedUsers];
        if (!isUserInActionInfo(requesterId, actionInfoList) && space.requiresApproval) {
            if (!isUserInActionInfo(requesterId, space.rejectedUsers)) {
                const request: ActionInfo = {
                    userId: requesterId,
                    actionAt: Timestamp.now(),
                };
                await this.spacesDB.updateSpace(space.docId, { pendingRequests: [...space.pendingRequests, request] });
            }
        } else {
            await this.joinSpace(requesterId, spaceId, space);
        }
    }

    /**
     * ユーザーのスペース参加状態を取得します。
     * @param userId ユーザーID
     * @param spaceId スペースID
     * @param spaceData スペースデータ（オプション）
     * @returns スペース参加状態
     */
    async getSpaceJoinState(userId: string, spaceId: string, spaceData?: SpaceData | null): Promise<JoinState> {
        const space = await this.fetchSpaceIfNeeded(spaceId, spaceData);
        if (!space) return "error";
        if (isUserInActionInfo(userId, space.rejectedUsers)) return "rejected";
        if (isUserInMembers(userId, space.members)) return "participated";
        if (isUserInActionInfo(userId, space.pendingRequests)) return "requesting";
        if (isUserInActionInfo(userId, space.approvedUsers) || isUserInActionInfo(userId, space.invitedUsers)) return "approved";
        return "noInfo";
    }

    /**
     * ユーザーのスペース参加状態を取得し、参加リクエストを送信します。
     * @param userId ユーザーID
     * @param spaceId スペースID
     * @returns スペース参加状態
     */
    async getSpaceJoinStateWithJoinRequest(userId: string, spaceId: string): Promise<JoinState> {
        const space = await this.spacesDB.getSpace(spaceId);
        const state = await this.getSpaceJoinState(userId, spaceId, space);
        if (state === "noInfo") {
            await this.joinSpaceRequest(userId, spaceId, space);
            return "requesting";
        }
        return state;
    }

    /**
     * 指定したユーザーIDに属するスペースをフィルタリングします。
     * @param userId - ユーザーID
     * @param spaces - スペースデータの配列
     * @returns 指定したユーザーIDに属するスペースの配列
     */
    filterSpacesByUserId(userId: string, spaces: SpaceData[]): SpaceData[] {
        return spaces.filter(space => Array.isArray(space.members) && space.members.some(member => member.userId === userId));
    }
}

export default SpaceService;