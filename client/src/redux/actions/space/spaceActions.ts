import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import serviceFactory from '../../../firebase/db/factory';
import store from '../../store';
import { setSpaces, setSpacesUpdateState } from '../../slices/space/spaceSlice';
import { autoUpdateCollection, fulfillWithState } from '../../../functions/redux/reduxUtils';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { UserDailyLogData } from '../../../types/firebase/db/user/userDailyLogsTypes';
import { loadData } from './learningSessionActions';


/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const autoUpdateSpaces = (dispatch: Dispatch, userId: string) => {
  const spacesDB = serviceFactory.getSpacesDB();
  const spaceService = serviceFactory.createSpaceService();

  autoUpdateCollection(
    spacesDB,
    userId,
    spaceService.filterSpacesByUserId.bind(spaceService),
    setSpaces,
    setSpacesUpdateState,
    () => store.getState().spaceSlice.spaces,
    dispatch
  );
};


export const updateTotalLearningTime = createAsyncThunk<
  AsyncThunkState<number>,
  string,
  { rejectValue: string }
>(
  "chatRoom/updateLearningTime",
  async (userId , { dispatch, rejectWithValue }) => {
    try {
      loadData(dispatch, userId);
      const prevTime = store.getState().spaceSlice.todayTotalLearningTime;
      
      const logsDB = serviceFactory.createUserDailyLogService();
      const data: UserDailyLogData | null = await logsDB.getDailyLog(userId);
      return fulfillWithState(data?.totalLearningTime ?? 0 + prevTime);
    } catch (error) {
      console.error("Error updating learning time:", error);
      return rejectWithValue("Failed to update learning time.");
    }
  }
);
