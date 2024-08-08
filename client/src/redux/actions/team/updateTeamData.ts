import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCurrentDisplayTeam } from '../../slices/team/teamSlice';
import { RootState } from '../../../types/module/redux/reduxTypes';
import serviceFactory from '../../../firebase/db/factory';
import { convertTimestampsToNumbers } from '../../../functions/db/dbUtils';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { SerializableTeamData } from '../../../types/firebase/db/team/teamsTypes';
import { fulfillWithState } from '../../../functions/redux/reduxUtils';

export const updateTeamData = createAsyncThunk<
  AsyncThunkState<SerializableTeamData[]>,
  string,
  { rejectValue: string }
>(
  'teams/updateTeamData',
  async (uid, { dispatch, getState, rejectWithValue }) => {
    try {
      const userTeamsDB = serviceFactory.createUserTeamsDB(uid);
      const userTeams = await userTeamsDB.getAllUserTeams();

      if (!userTeams) {
        return rejectWithValue('ユーザーに対応するチームデータが見つかりませんでした。');
      }

      const teamService = serviceFactory.createTeamService();
      const teamsData = await teamService.fetchApprovedTeamsForUser(userTeams);
      const convertedTeamsData = convertTimestampsToNumbers(teamsData);

      // 表示中のチームがなければ、自動で設定
      const state = getState() as RootState;
      const { currentDisplayTeam } = state.teamSlice;
      if (!currentDisplayTeam && convertedTeamsData.length > 0) {
        dispatch(setCurrentDisplayTeam(convertedTeamsData[0]));
      }

      return fulfillWithState(convertedTeamsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      console.error('チームデータの更新中にエラーが発生しました:', error);
      return rejectWithValue(errorMessage);
    }
  }
);
