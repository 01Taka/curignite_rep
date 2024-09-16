import serviceFactory from "../../firebase/db/factory";
import { IndexedLearningSessionService } from "../../functions/browserStorage/indexedDB/services/indexedLearningSessionService";

const getServices = () => {
  return {
    learningService: serviceFactory.createUserLearningGoalService(),
    userService: serviceFactory.createUserService(),
  };
};

export const startSession = async (userId: string, learningGoalId: string) => {
  try {
    await IndexedLearningSessionService.startSession(userId, learningGoalId);
  } catch (error) {
    console.error("Failed to start session:", error);
  }
};

export const endSession = async (userId: string, learningGoalId: string) => {
  try {
    await IndexedLearningSessionService.endCurrentSession(userId, learningGoalId);
  } catch (error) {
    console.error("Failed to end session:", error);
  }
};



/**
 * 現在のIndexedDBに保存されているSessionをFirestoreに保存します。
 * IndexedDBのデータはクリアされます。
 */
export const saveSessionsToFirestore = async (userId: string, learningGoalId: string) => {
  try {
    const indexedDBSessions = await IndexedLearningSessionService.getAllSessions(
      userId,
      learningGoalId
    );

    if (indexedDBSessions.length === 0) return;

    const { learningService } = getServices();
    const savePromise = indexedDBSessions.map(session =>
      learningService.addSessionToGoal(
        session.uid,
        session.learningGoalId,
        session.startTime,
        session.endTime
      )
    );

    await Promise.all(savePromise);
    await IndexedLearningSessionService.clearSessions(userId, learningGoalId);
  } catch (error) {
    console.error("Failed to save sessions to Firestore:", error);
  }
};
