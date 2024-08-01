import { SpacePublicationTarget, SpaceData, UserSpaceIds } from "../../../../types/firebase/db/space/spacesTypes";
import ChatRoomsDB from "../chat/chatRooms";
import { TeamService } from "../team/teamService";
import { UsersDB } from "../user/users";
import { UserService } from "../user/userService";
import SpacesDB from "./spaces";

export class SpaceService {
    constructor(
        private spacesDB: SpacesDB,
        private usersDB: UsersDB,
        private chatRoomsDB: ChatRoomsDB,
        private userService: UserService,
        private teamService: TeamService,
    ) { }
        
    /**
     * 新しいスペースの作成、チャットルームの設定、作成者のユーザーデータにスペースIDの追加などの処理を担当。
     * @param createdById - スペースを作成したユーザーのID
     * @param spaceName - 作成するスペースの名前
     * @param description - スペースの説明
     * @param publicationTarget - スペースの公開対象
     * @param requiresApproval - スペースへの参加が承認を必要とするかどうか
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
            // 新しいスペースを作成
            const spaceRef = await this.spacesDB.createSpace(createdById, spaceName, description, publicationTarget, requiresApproval);
            
            // 作成したスペースのIDを取得
            const newSpaceId = spaceRef.id;

            // 作成者のユーザー情報を取得
            const user = await this.usersDB.read(createdById);
            if (!user) {
                throw new Error(`User with ID ${createdById} not found.`);
            }

            // チャットルームを作成し、そのIDをスペースに設定
            const chatRoomRef = await this.chatRoomsDB.createChatRoom(createdById, spaceName, user.iconUrl, newSpaceId, "space");
            await this.spacesDB.update(newSpaceId, { chatRoomId: chatRoomRef.id });


            // 作成ユーザーのスペースIDリストを更新
            this.userService.appendSpaceIdToUserData(user, newSpaceId);

            // reduxへの追加処理も今後追加予定

        } catch (error) {
            console.error("Error creating space:", error);
            throw new Error("Failed to create space.");
        }
    }

    /**
     * 同じチームに参加しているメンバーのユーザーIDとそのスペースIDを取得します。
     * @returns 同じチームに参加している各メンバーのユーザーIDと、そのスペースIDのリスト
     */
    async getSameTeamMembersSpaceIds(): Promise<UserSpaceIds[]> {
        try {
            // チームのメンバーを取得
            const members = await this.teamService.fetchAllUsersInTeamsByUser();
    
            // メンバーのユーザーデータから spaceIds を取得
            const membersSpaceIds: (UserSpaceIds | null)[] = await Promise.all(members.map(async (member) => {
                const memberData = await this.usersDB.read(member.userId);
                return memberData ? { userId: memberData.docId, spaceIds: memberData.spaceIds } as UserSpaceIds : null;
            }));
    
            // null を除外して返す
            return membersSpaceIds.filter(item => item !== null) as UserSpaceIds[];
        } catch (error) {
            console.error("Error getting same team members' space IDs:", error);
            return [];
        }
    }
    async getSpaceDataByUserSpaceIds(userSpaceIds: UserSpaceIds[]): Promise<SpaceData[]> {
        try {
            // 各ユーザーのスペースIDリストをフラットにし、それぞれのIDで非同期読み込みを行う
            const spaceIds = userSpaceIds.flatMap(data => data.spaceIds);
            
            // 各スペースIDについて非同期読み込みを行う
            const spacePromises = spaceIds.map(id => this.spacesDB.read(id));
            
            // すべてのスペースデータを取得
            const spaces = await Promise.all(spacePromises);

            const filteringSpaces = spaces.filter(space => space !== null);
            
            return filteringSpaces as SpaceData[];
        } catch (error) {
            console.error("Failed to get space data:", error);
            return []; // エラー発生時には空の配列を返す
        }
    }
}

