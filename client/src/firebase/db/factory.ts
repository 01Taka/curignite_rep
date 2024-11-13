import { Firestore } from 'firebase/firestore';
import { db } from '../firebase';
import { StorageManager, storageManager } from '../storage/storageManager';
// ユーザー関連サービス
import { UserService } from './app/user/userService';
import { UserTeamService } from './app/user/subCollection/userTeamService';
import { UserPartnerService } from './app/user/subCollection/userPartnerService';
import { UserLearningGoalService } from './app/user/subCollection/userLearningGoalService';
import { UserDailyLearningSummaryService } from './app/user/subCollection/userDailyLearningSummary';
import { UserHelpService } from './app/user/subCollection/userHelpService';
import { HelpAnswerService } from './app/user/subCollection/helpAnswerService';

// ユーザータスク関連サービス
import { IndividualTaskService } from './app/user/subCollection/task/individualTaskService';
import { ProblemSetService } from './app/user/subCollection/task/problemSetService';
import { ProblemSetActivityService } from './app/user/subCollection/task/problemSetActivityService';
import { ProblemSetCategoryService } from './app/user/subCollection/task/problemSetCategoryService';
import { problemSetStepPlanService } from './app/user/subCollection/task/taskStep/problemSetStepPlanService';

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
import { UserStateManager } from './app/user/userStateManager';
import { UserTaskPlanManager } from './app/user/userTaskPlanManager';


type ConstructorWithArgs<T, Args extends any[]> = new (...args: Args) => T;

export class ServiceFactory {
  private instances: Map<string, any> = new Map();

  constructor(
    private firestore: Firestore,
    private storageManager: StorageManager
  ) {}

  private getInstance<T, Args extends any[]>(
    key: string,
    classConstructor: ConstructorWithArgs<T, Args>,
    ...args: Args
  ): T {
    if (!this.instances.get(key)) {
      this.instances.set(key, new classConstructor(...args));
    }
    return this.instances.get(key) as T;
  }

  createUserService() {
    return this.getInstance(
      'user',
      UserService,
      this.firestore,
      this.storageManager,
      this.createTeamMemberService()
    );
  }

  createUserStateManager() {
    return this.getInstance(
      'userState',
      UserStateManager,
      this.createUserService()
    )
  }

  createUserTaskPlanManager() {
    return this.getInstance(
      'userTaskPlan',
      UserTaskPlanManager,
      this.createUserService()
    )
  }

  createUserTeamService() {
    return this.getInstance('userTeam', UserTeamService, this.firestore);
  }

  createUserPartnerService() {
    return this.getInstance('userPartner', UserPartnerService, this.firestore);
  }

  createUserLearningGoalService() {
    return this.getInstance('userGoal', UserLearningGoalService, this.firestore);
  }

  createUserDailyLearningSummary() {
    return this.getInstance('userDailyLearningSummary', UserDailyLearningSummaryService, this.firestore);
  }

  createUserHelpService() {
    return this.getInstance('userHelp', UserHelpService, this.firestore, this.storageManager, this.createHelpAnswerService());
  }

  createHelpAnswerService() {
    return this.getInstance('helpAnswer', HelpAnswerService, this.firestore, this.storageManager);
  }

  createIndividualTaskService() {
    return this.getInstance('individualTask', IndividualTaskService, this.firestore);
  }

  createProblemSetService() {
    return this.getInstance('problemSet', ProblemSetService, this.firestore);
  }

  createProblemSetStepPlanService() {
    return this.getInstance('problemSetStepPlan', problemSetStepPlanService, this.firestore);
  }

  createProblemSetActivityService() {
    return this.getInstance('problemSetActivity', ProblemSetActivityService, this.firestore)
  }

  createProblemSetCategoryService() {
    return this.getInstance('problemSetCategory', ProblemSetCategoryService, this.firestore)
  }

  createTeamService() {
    return this.getInstance(
      'team',
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
    return this.getInstance('teamJoinRequest', TeamJoinRequestService, this.firestore, this.createUserTeamService());
  }

  createTeamMemberService() {
    return this.getInstance('teamMember', TeamMemberService, this.firestore, this.createUserTeamService());
  }

  createTeamCodeService() {
    return this.getInstance('teamCode', TeamCodeService, this.firestore);
  }

  createSpaceService() {
    return this.getInstance(
      'space',
      SpaceService,
      this.firestore,
      this.createSpaceMemberService(),
      this.createSpaceJoinRequestService(),
      this.createUserStateManager(),
      this.createChatRoomService()
    );
  }

  createSpaceJoinRequestService() {
    return this.getInstance('spaceJoinRequest', SpaceJoinRequestService, this.firestore);
  }

  createSpaceMemberService() {
    return this.getInstance('spaceMember', SpaceMemberService, this.firestore);
  }

  createChatRoomService() {
    return this.getInstance('chatRoom', ChatRoomService, this.firestore);
  }

  createChatRoomChatService() {
    return this.getInstance('chatRoomChat', ChatRoomChatService, this.firestore, this.storageManager);
  }
}

const serviceFactory = new ServiceFactory(db, storageManager);

export default serviceFactory;
