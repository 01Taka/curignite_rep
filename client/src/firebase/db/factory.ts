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
import { TeamGroupService } from "./app/team/subCollection/teamGroupService";
import { TeamGroupsDB } from "./app/team/subCollection/teamGroup";
import UserDailyLogsDB from "./app/user/subCollection/userDailyLogs";
import { UserDailyLogService } from "./app/user/subCollection/userDailyLogsService";

class ServiceFactory {
    private firestore: Firestore;
    private instances: Record<string, any> = {};

    constructor(firestore: Firestore) {
        this.firestore = firestore;
    }

    private getInstance<T>(key: string, InstanceClass: new (firestore: Firestore) => T): T {
        if (!this.instances[key]) {
            this.instances[key] = new InstanceClass(this.firestore);
        }
        return this.instances[key];
    }

    getTeamsDB = (): TeamsDB => this.getInstance("teamsDB", TeamsDB);
    getTeamCodesDB = (): TeamCodesDB => this.getInstance("teamCodesDB", TeamCodesDB);
    getSpacesDB = (): SpacesDB => this.getInstance("spacesDB", SpacesDB);
    getUsersDB = (): UsersDB => this.getInstance("usersDB", UsersDB);
    getChatRoomsDB = (): ChatRoomsDB => this.getInstance("chatRoomsDB", ChatRoomsDB);

    createUserTeamsDB = (userId: string): UserTeamsDB => new UserTeamsDB(this.firestore, userId);
    createUserDailyLogsDB = (userId: string): UserDailyLogsDB => new UserDailyLogsDB(this.firestore, userId);
    createTeamGroupsDB = (teamId: string): TeamGroupsDB => new TeamGroupsDB(this.firestore, teamId);
    createChatRoomsChatsDB = (roomId: string): ChatRoomChatsDB => new ChatRoomChatsDB(this.firestore, roomId);

    createUserService = (): UserService => new UserService(this.getUsersDB());

    createUserTeamService = (): UserTeamService => 
        new UserTeamService(
            this.getTeamsDB(),
            this.getUsersDB(),
            this.createTeamCodeService(),
            this.createTeamGroupService(),
            this.createUserTeamsDB
        );
    
    createUserDailyLogService = (): UserDailyLogService => 
        new UserDailyLogService(
            this.createUserDailyLogsDB
        );

    createTeamService = (): TeamService => 
        new TeamService(this.getTeamsDB(), this.createUserService());

    createSpaceService = (): SpaceService => {
        return new SpaceService(
            this.getSpacesDB(),
            this.getUsersDB(),
            this.getChatRoomsDB(),
            this.createUserService(),
            this.createTeamService(),
            this.createUserTeamsDB
        );
    }

    createTeamCodeService = (): TeamCodeService => 
        new TeamCodeService(this.getTeamCodesDB(), this.getTeamsDB());

    createTeamGroupService = (): TeamGroupService => 
        new TeamGroupService(this.getChatRoomsDB(), this.createTeamGroupsDB)

    createChatRoomChatService = (): ChatRoomChatService => 
        new ChatRoomChatService(this.getUsersDB(), this.createChatRoomsChatsDB);
}

const serviceFactory = new ServiceFactory(db);

export default serviceFactory;
