import { Firestore } from "firebase/firestore";
import { db } from "../firebase";
import { StorageManager, storageManager } from "../storage/storageManager";

// Team-related imports
import TeamsDB from "./app/team/teams";
import TeamCodesDB from "./app/team/teamCodes";
import { TeamService } from "./app/team/teamService";
import { TeamCodeService } from "./app/team/teamCodeService";
import { TeamGroupService } from "./app/team/subCollection/teamGroupService";
import { TeamGroupsDB } from "./app/team/subCollection/teamGroup";

// Space-related imports
import SpacesDB from "./app/space/spaces";
import { SpaceService } from "./app/space/SpaceService";

// User-related imports
import { UsersDB } from "./app/user/users";
import { UserService } from "./app/user/userService";
import { UserTeamsDB } from "./app/user/subCollection/userTeams";
import { UserTeamService } from "./app/user/subCollection/userTeamService";
import UserDailyLogsDB from "./app/user/subCollection/userDailyLogs";
import { UserDailyLogService } from "./app/user/subCollection/userDailyLogsService";

// Chat-related imports
import ChatRoomsDB from "./app/chat/chatRooms";
import ChatRoomChatService from "./app/chat/subCollection/chatRoomChatService";
import ChatRoomChatsDB from "./app/chat/subCollection/chatRoomChats";

// Task-related imports
import TaskListsDB from "./app/todo/taskLists";
import { TaskListService } from "./app/todo/taskListService";
import TaskCollectionBatchTasksDB from "./app/todo/subCollection/subCollection/taskCollectionBatchTasks";
import TaskListIndividualTasksDB from "./app/todo/subCollection/taskListIndividualTasks";
import TaskListTaskCollectionsDB from "./app/todo/subCollection/taskListTaskCollection";
import { TaskListIndividualTaskService } from "./app/todo/subCollection/taskListIndividualTaskService";
import { TaskCollectionBatchTaskService } from "./app/todo/subCollection/subCollection/taskCollectionBatchTaskService";
import { TaskListTaskCollectionService } from "./app/todo/subCollection/taskListTaskCollectionService";
//

class ServiceFactory {
    private firestore: Firestore;
    private instances: Record<string, any> = {};

    constructor(firestore: Firestore, private storageManager: StorageManager) {
        this.firestore = firestore;
    }

    private getInstance<T>(key: string, InstanceClass: new (firestore: Firestore) => T): T {
        if (!this.instances[key]) {
            this.instances[key] = new InstanceClass(this.firestore);
        }
        return this.instances[key];
    }

    // トップコレクション
    getTeamsDB = (): TeamsDB => this.getInstance("teamsDB", TeamsDB);
    getTeamCodesDB = (): TeamCodesDB => this.getInstance("teamCodesDB", TeamCodesDB);
    getSpacesDB = (): SpacesDB => this.getInstance("spacesDB", SpacesDB);
    getUsersDB = (): UsersDB => this.getInstance("usersDB", UsersDB);
    getChatRoomsDB = (): ChatRoomsDB => this.getInstance("chatRoomsDB", ChatRoomsDB);
    getTaskListsDB = (): TaskListsDB => this.getInstance("taskLists", TaskListsDB);

    // サブコレクション
    createUserTeamsDB = (userId: string): UserTeamsDB => new UserTeamsDB(this.firestore, userId);
    createUserDailyLogsDB = (userId: string): UserDailyLogsDB => new UserDailyLogsDB(this.firestore, userId);
    createTeamGroupsDB = (teamId: string): TeamGroupsDB => new TeamGroupsDB(this.firestore, teamId);
    createChatRoomsChatsDB = (roomId: string): ChatRoomChatsDB => new ChatRoomChatsDB(this.firestore, roomId);
    createTaskListIndividualTasksDB = (taskListId: string) => new TaskListIndividualTasksDB(this.firestore, taskListId);
    createTaskListTaskCollectionsDB = (taskListId: string) => new TaskListTaskCollectionsDB(this.firestore, taskListId);
    createTaskCollectionBatchTasksDB = (taskListId: string, taskCollectionId: string) => new TaskCollectionBatchTasksDB(this.firestore, taskListId, taskCollectionId);

    // コレクションサービス
    createUserService = (): UserService => new UserService(
        this.getUsersDB(),
        this.createUserTeamService(),
        this.createTaskListService(),
    );

    createUserTeamService = (): UserTeamService => 
        new UserTeamService(
            this.getTeamsDB(),
            this.getUsersDB(),
            this.createTeamService(),
            this.createTeamCodeService(),
            this.createTeamGroupService(),
            this.createUserTeamsDB
        );
    
    createUserDailyLogService = (): UserDailyLogService => 
        new UserDailyLogService(
            this.createUserDailyLogsDB
        );

    createTeamService = (): TeamService => 
        new TeamService(this.getTeamsDB(), this.storageManager);

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

    createTaskListService = (): TaskListService => 
        new TaskListService(this.getTaskListsDB(),
        this.getUsersDB(),
        this.createTaskListIndividualTaskService(),
        this.createTaskCollectionBatchTaskService()
    );

    createTaskListIndividualTaskService = (): TaskListIndividualTaskService => 
        new TaskListIndividualTaskService(this.createTaskListIndividualTasksDB);

    createTaskListTaskCollectionService = (): TaskListTaskCollectionService => 
        new TaskListTaskCollectionService(this.createTaskListTaskCollectionsDB);

    createTaskCollectionBatchTaskService = (): TaskCollectionBatchTaskService => 
        new TaskCollectionBatchTaskService(this.createTaskCollectionBatchTasksDB, this.createTaskListTaskCollectionsDB);
}

const serviceFactory = new ServiceFactory(db, storageManager);

export default serviceFactory;
