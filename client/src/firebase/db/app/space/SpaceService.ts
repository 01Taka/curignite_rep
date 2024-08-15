import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import { isUserInActionInfo, isUserInMembers } from "../../../../functions/db/dbUtils";
import { uniqueByProperty } from "../../../../functions/objectUtils";
import ChatRoomsDB from "../chat/chatRooms";
import { TeamService } from "../team/teamService";
import { UsersDB } from "../user/users";
import { UserService } from "../user/userService";
import SpacesDB from "./spaces";
import { SpaceData, SpacePublicationTarget, UserSpaceIds } from "../../../../types/firebase/db/space/spacesTypes";
import { ActionInfo, JoinState, Member, RoleType } from "../../../../types/firebase/db/baseTypes";
import { UserTeamsDB } from "../user/subCollection/userTeams";

type SpaceInfo = string | SpaceData;

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
    ): Promise<DocumentReference<DocumentData, DocumentData>> {
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
            return spaceRef;
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
     * @param spaceInfo - スペースのDocIDかスペースインスタンス
     * @returns スペースデータ
     * @throws Error - スペースデータが見つからなかった場合
     */
    private async fetchSpaceIfNeeded(spaceInfo: SpaceInfo): Promise<{
        spaceId: string;
        spaceData: SpaceData;
    }> {
        let spaceId: string;
        let spaceData: SpaceData | null;

        if (typeof spaceInfo === "string") {
            spaceId = spaceInfo;
            spaceData = await this.spacesDB.getSpace(spaceId);
        } else {
            spaceId = spaceInfo.docId;
            spaceData = spaceInfo;
        }

        if (!spaceData) {
            throw new Error(`Space data not found for space ID: ${spaceId}.`);
        }

        return { spaceId, spaceData };
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
     * @param spaceInfo スペースのDocIDかスペースインスタンス
     */
    async joinSpace(userId: string, spaceInfo: SpaceInfo): Promise<void> {
        const { spaceData } = await this.fetchSpaceIfNeeded(spaceInfo);
        if (!isUserInMembers(userId, spaceData.members)) {
            await this.addUserToMembers(userId, spaceData);
        }
    }

    /**
     * スペース参加リクエストを処理します。
     * @param requesterId リクエストしたユーザーID
     * @param spaceInfo スペースのDocIDかスペースインスタンス
     */
    async joinSpaceRequest(
        requesterId: string,
        spaceInfo: SpaceInfo
    ): Promise<void> {
        const { spaceId, spaceData } = await this.fetchSpaceIfNeeded(spaceInfo);
        if (!spaceData || !spaceData.approvedUsers || !spaceData.invitedUsers || !spaceData.pendingRequests) return;

        const actionInfoList = [...spaceData.invitedUsers, ...spaceData.approvedUsers];

        if (!isUserInActionInfo(requesterId, actionInfoList) && spaceData.requiresApproval) {
            if (!isUserInActionInfo(requesterId, spaceData.rejectedUsers)) {
                const request: ActionInfo<"pending"> = {
                    userId: requesterId,
                    actionAt: Timestamp.now(),
                    actionType: "pending", // 明示的に "pending" を設定
                };
                await this.spacesDB.updateSpace(spaceId, {
                    pendingRequests: [...spaceData.pendingRequests, request],
                });
            }
        } else {
            await this.joinSpace(requesterId, spaceId);
        }
    } 

    /**
     * ユーザーのスペース参加状態を取得します。
     * @param userId ユーザーID
     * @param spaceInfo スペースのDocIDかスペースインスタンス
     * @returns スペース参加状態
     */
    async getSpaceJoinState(userId: string, spaceInfo: SpaceInfo): Promise<JoinState> {
        const { spaceData } = await this.fetchSpaceIfNeeded(spaceInfo);
        if (isUserInActionInfo(userId, spaceData.rejectedUsers)) return "rejected";
        if (isUserInMembers(userId, spaceData.members)) return "participated";
        if (isUserInActionInfo(userId, spaceData.pendingRequests)) return "requesting";
        if (isUserInActionInfo(userId, spaceData.approvedUsers) || isUserInActionInfo(userId, spaceData.invitedUsers)) return "approved";
        return "noInfo";
    }

    /**
     * ユーザーのスペース参加状態を取得し、参加リクエストを送信します。
     * @param userId ユーザーID
     * @param spaceInfo スペースのDocIDかスペースインスタンス
     * @returns スペース参加状態
     */
    async getSpaceJoinStateWithJoinRequest(userId: string, spaceInfo: SpaceInfo): Promise<JoinState> {
        const { spaceData } = await this.fetchSpaceIfNeeded(spaceInfo);
        const state = await this.getSpaceJoinState(userId, spaceData);
        if (state === "noInfo") {
            await this.joinSpaceRequest(userId, spaceData);
            return "requesting";
        }
        return state;
    }

    async leaveSpace(userId: string, spaceInfo: SpaceInfo) {
        const { spaceId } = await this.fetchSpaceIfNeeded(spaceInfo);
        const space = await this.spacesDB.getSpace(spaceId);
        if (!space) {
            return
        }
        const members = space.members;
        if (space && isUserInMembers(userId, members)) {
            const leavedMembers = members.filter(member => member.userId !== userId);
            const selfData = members.find(member => member.userId === userId);
            const awayUsers = [...space.awayUsers, selfData!];
            await this.spacesDB.updateSpace(spaceId, { members: leavedMembers, awayUsers });
        }
    }

    async rejoinSpace(userId: string, spaceInfo: SpaceInfo) {
        const { spaceId, spaceData } = await this.fetchSpaceIfNeeded(spaceInfo);
        if (!spaceData) {
            return
        }
        const awayUsers = spaceData.awayUsers;
        if (spaceData && isUserInMembers(userId, awayUsers)) {
            const awayMembers = awayUsers.filter(user => user.userId !== userId);
            const selfData = awayUsers.find(user => user.userId === userId);
            const members = [...spaceData.members, selfData!];
            await this.spacesDB.updateSpace(spaceId, { members, awayUsers: awayMembers });
        }
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