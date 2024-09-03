import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import serviceFactory from '../../../firebase/db/factory';
import store from '../../store';
import { assignSpaceInfoMap, setSpacesUpdateState } from '../../slices/space/spaceSlice';
import { autoUpdateCollection, fulfillWithState } from '../../../functions/redux/reduxUtils';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { UserDailyLogData } from '../../../types/firebase/db/user/userDailyLogsTypes';
import { loadData } from './learningSessionActions';
import { SpaceData, SpaceFullData } from '../../../types/firebase/db/space/spaceStructure';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { revertTimestampConversion } from '../../../functions/db/dataFormatUtils';

export const getSpaceInfo = (spaceId: string): Partial<SpaceFullData> => {
  const value = store.getState().spaceSlice.spaceInfoMap[spaceId];
  return value ? revertTimestampConversion(value) : {};
}

/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const autoUpdateSpaces = (dispatch: Dispatch, userId: string) => {
  const spaceService = serviceFactory.createSpaceService();
  const spaceMemberService = serviceFactory.createSpaceMemberService();

  const setFunc = (updatedData: SpaceData[]) => {
    const prevData = store.getState().spaceSlice.spaceInfoMap;
  
    const dataMap: TimestampConvertedDocumentMap<Partial<SpaceFullData>> = updatedData.reduce((map, data) => {
      const existingData = prevData[data.docId] || {};
      
      // 既存のデータを保持しつつ、必要な部分だけを上書きする
      map[data.docId] = {
        ...existingData,
        space: data,
      };
      
      return map;
    }, {} as TimestampConvertedDocumentMap<Partial<SpaceFullData>>);
  
    dispatch(assignSpaceInfoMap({ ...prevData, ...dataMap }));
  };

  autoUpdateCollection(
    spaceService.baseDB,
    userId,
    spaceMemberService.filterNonMemberSpace.bind(spaceService),
    setFunc,
    setSpacesUpdateState,
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
      
      const logsDB = serviceFactory.createUserDailyLogsService();
      const data: UserDailyLogData | null = await logsDB.getDailyLog(userId);
      return fulfillWithState(data?.totalLearningTime ?? 0 + prevTime);
    } catch (error) {
      console.error("Error updating learning time:", error);
      return rejectWithValue("Failed to update learning time.");
    }
  }
);
