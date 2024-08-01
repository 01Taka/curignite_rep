import { Firestore } from "firebase/firestore";
import TeamsDB from "./app/team/teams";
import TeamCodesDB from "./app/team/teamCodes";
import SpacesDB from "./app/space/spaces";
import { UsersDB } from "./app/user/users";
import { TeamService } from "./app/team/teamService";
import { UserTeamsDB } from "./app/user/subCollection/userTeams";
import { UserTeamService } from "./app/user/subCollection/userTeamService";
import { TeamCodeService } from "./app/team/teamCodeService";
import { SpaceService } from "./app/space/SpaceService";
import ChatRoomsDB from "./app/chat/chatRooms";
import { UserService } from "./app/user/userService";
import ChatRoomChatService from "./app/chat/subCollection/chatRoomChatService";
import ChatRoomChatsDB from "./app/chat/subCollection/chatRoomChats";
import { db } from "../firebase";

class ServiceFactory {
    private firestore: Firestore;
    private teamsDB?: TeamsDB;
    private teamCodesDB?: TeamCodesDB;
    private spacesDB?: SpacesDB;
    private usersDB?: UsersDB;
    private chatRoomsDB?: ChatRoomsDB;

    constructor(firestore: Firestore) {
        this.firestore = firestore;
    }

    /**
     * TeamsDB のインスタンスを取得する
     * @returns TeamsDB のインスタンス
     */
    getTeamsDB(): TeamsDB {
        if (!this.teamsDB) {
            this.teamsDB = new TeamsDB(this.firestore);
        }
        return this.teamsDB;
    }

    /**
     * TeamCodesDB のインスタンスを取得する
     * @returns TeamCodesDB のインスタンス
     */
    getTeamCodesDB(): TeamCodesDB {
        if (!this.teamCodesDB) {
            this.teamCodesDB = new TeamCodesDB(this.firestore);
        }
        return this.teamCodesDB;
    }

    /**
     * SpacesDB のインスタンスを取得する
     * @returns SpacesDB のインスタンス
     */
    getSpacesDB(): SpacesDB {
        if (!this.spacesDB) {
            this.spacesDB = new SpacesDB(this.firestore);
        }
        return this.spacesDB;
    }

    /**
     * UsersDB のインスタンスを取得する
     * @returns UsersDB のインスタンス
     */
    getUsersDB(): UsersDB {
        if (!this.usersDB) {
            this.usersDB = new UsersDB(this.firestore);
        }
        return this.usersDB;
    }

    /**
     * ChatRoomsDB のインスタンスを取得する
     * @returns ChatRoomsDB のインスタンス
     */
    getChatRoomsDB(): ChatRoomsDB {
        if (!this.chatRoomsDB) {
            this.chatRoomsDB = new ChatRoomsDB(this.firestore);
        }
        return this.chatRoomsDB;
    }

    /**
     * UserTeamsDB のインスタンスを作成する
     * @param userId - ユーザーID
     * @returns UserTeamsDB のインスタンス
     */
    createUserTeamsDB(userId: string): UserTeamsDB {
        return new UserTeamsDB(this.firestore, userId);
    }

    /**
     * ChatRoomsChatsDB のインスタンスを作成する
     * @param roomId - チャットルームID
     * @returns ChatRoomsChatsDB のインスタンス
     */
    createChatRoomsChatsDB(roomId: string): ChatRoomChatsDB {
        return new ChatRoomChatsDB(this.firestore, roomId);
    }

    /**
     * UserService のインスタンスを作成する
     * @returns UserService のインスタンス
     */
    createUserService(): UserService {
        return new UserService(this.getUsersDB());
    }

    /**
     * UserTeamService のインスタンスを作成する
     * @param userId - ユーザーID
     * @returns UserTeamService のインスタンス
     */
    createUserTeamService(userId: string): UserTeamService {
        return new UserTeamService(this.firestore, userId);
    }

    /**
     * TeamService のインスタンスを作成する
     * @param userId - ユーザーID
     * @returns TeamService のインスタンス
     */
    createTeamService(userId: string): TeamService {
        const userTeamsDB = this.createUserTeamsDB(userId);
        const userTeamService = this.createUserTeamService(userId);
        const teamCodeService = this.createTeamCodeService();

        return new TeamService(
            this.getTeamsDB(),
            this.getUsersDB(),
            userTeamsDB,
            teamCodeService,
            userTeamService
        );
    }

    /**
     * SpaceService のインスタンスを作成する
     * @param userId - ユーザーID
     * @returns SpaceService のインスタンス
     */
    createSpaceService(userId: string): SpaceService {
        const teamService = this.createTeamService(userId);
        const userService = this.createUserService();

        return new SpaceService(this.getSpacesDB(), this.getUsersDB(), this.getChatRoomsDB(), userService, teamService);
    }

    /**
     * TeamCodeService のインスタンスを取得する
     * @returns TeamCodeService のインスタンス
     */
    private createTeamCodeService(): TeamCodeService {
        return new TeamCodeService(this.getTeamCodesDB(), this.getTeamsDB());
    }

    /**
     * ChatRoomChatService のインスタンスを作成する
     * @param roomId - ユーザーID
     * @returns ChatRoomChatService のインスタンス
     */
    createChatRoomChatService(roomId: string): ChatRoomChatService {
        return new ChatRoomChatService(this.createChatRoomsChatsDB(roomId), this.getUsersDB());
    }
}

const serviceFactory = new ServiceFactory(db);

export default serviceFactory;