import { Firestore } from 'firebase/firestore';
import { db } from '../firebase';
import { StorageManager, storageManager } from '../storage/storageManager';
// ユーザー関連サービス
import { UserService } from './app/user/userService';
import { UserTeamService } from './app/user/subCollection/userTeamService';
import { UserTaskManagementService } from './app/user/subCollection/userTaskManagementService';
import { UserPartnerService } from './app/user/subCollection/userPartnerService';
import { UserLearningGoalService } from './app/user/subCollection/userLearningGoalService';
import { UserDailyLearningSummaryService } from './app/user/subCollection/userDailyLearningSummary';
import { UserHelpService } from './app/user/subCollection/userHelpService';
import { HelpAnswerService } from './app/user/subCollection/helpAnswerService';

// チーム関連サービス
import { TeamService } from './app/team/teamService';
import { TeamJoinRequestService } from './app/team/subCollection/teamJoinRequestService';
import { TeamMemberService } from './app/team/subCollection/teamMemberService';
import { TeamCodeService } from './app/team/teamCodeService';

// スペース関連サービス
import { SpaceService } from './app/space/SpaceService';
import { SpaceJoinRequestService } from './app/space/subCollection/spaceJoinRequestService';
import { SpaceMemberService } from './app/space/subCollection/spaceMemberService';

// チャット関連サービス
import { ChatRoomService } from './app/chat/chatRoomService';
import { ChatRoomChatService } from './app/chat/subCollection/chatRoomChatService';

type Constructor<T> = new (...args: any[]) => T;

class ServiceFactory {
  private instances: Map<string, any> = new Map();

  constructor(
    private firestore: Firestore,
    private storageManager: StorageManager
  ) {}

  private getInstance<T>(
    key: string,
    InstanceClass: Constructor<T>,
    ...args: ConstructorParameters<Constructor<T>>
  ): T {
    if (!this.instances.get(key)) {
      this.instances.set(key, new InstanceClass(...args));
    }
    return this.instances.get(key) as T;
  }

  createUserService() {
    return this.getInstance(
      'userService',
      UserService,
      this.firestore,
      this.storageManager,
      this.createTeamMemberService()
    );
  }

  createUserTeamService() {
    return this.getInstance('userTeamService', UserTeamService, this.firestore);
  }

  createUserTaskManagementService() {
    return this.getInstance('userTaskManagementService', UserTaskManagementService, this.firestore);
  }

  createUserPartnerService() {
    return this.getInstance('userPartnerService', UserPartnerService, this.firestore);
  }

  createUserLearningGoalService() {
    return this.getInstance('userGoalService', UserLearningGoalService, this.firestore);
  }

  createUserDailyLearningSummary() {
    return this.getInstance('userDailyLearningSummary', UserDailyLearningSummaryService, this.firestore)
  }

  createUserHelpService() {
    return this.getInstance('userHelpService', UserHelpService, this.firestore, this.storageManager, this.createHelpAnswerService());
  }

  createHelpAnswerService() {
    return this.getInstance('helpAnswerService', HelpAnswerService, this.firestore, this.storageManager);
  }

  createTeamService() {
    return this.getInstance(
      'teamService',
      TeamService,
      this.firestore,
      this.storageManager,
      this.createTeamMemberService(),
      this.createTeamJoinRequestService(),
      this.createTeamCodeService(),
      this.createUserTeamService(),
      this.createChatRoomService()
    );
  }

  createTeamJoinRequestService() {
    return this.getInstance('teamJoinRequestService', TeamJoinRequestService, this.firestore, this.createUserTeamService());
  }

  createTeamMemberService() {
    return this.getInstance('teamMemberService', TeamMemberService, this.firestore, this.createUserTeamService());
  }

  createTeamCodeService() {
    return this.getInstance('teamCodeService', TeamCodeService, this.firestore);
  }

  createSpaceService() {
    return this.getInstance(
      'spaceService',
      SpaceService,
      this.firestore,
      this.createSpaceMemberService(),
      this.createSpaceJoinRequestService(),
      this.createUserService(),
      this.createChatRoomService()
    );
  }

  createSpaceJoinRequestService() {
    return this.getInstance('spaceJoinRequestService', SpaceJoinRequestService, this.firestore);
  }

  createSpaceMemberService() {
    return this.getInstance('spaceMemberService', SpaceMemberService, this.firestore);
  }

  createChatRoomService() {
    return this.getInstance('chatRoomService', ChatRoomService, this.firestore);
  }

  createChatRoomChatService() {
    return this.getInstance('chatRoomChatService', ChatRoomChatService, this.firestore, this.storageManager);
  }
}

const serviceFactory = new ServiceFactory(db, storageManager);

export default serviceFactory;
