import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCurrentDisplayTeam, setTeamRequestStatus, setTeamsNotFound, updateTeamsSuccess } from "../../slices/teamSlice";
import { RootState } from '../../../types/module/redux/reduxTypes';
import serviceFactory from '../../../firebase/db/factory';
import { convertTimestampsToNumbers } from '../../../functions/db/dbUtils';

export const updateTeamData = createAsyncThunk<void, string>(
  'teams/updateTeamData',
  async (uid, { dispatch, getState }) => {
    try {
      if (uid) {
        dispatch(setTeamRequestStatus("loading"));

        const teamService = serviceFactory.createTeamService(uid);
        const teamsData = await teamService.getApprovedTeams();

        if (teamsData.length === 0) {
          dispatch(setTeamsNotFound());
        } else {
          const convertedTeamsData = convertTimestampsToNumbers(teamsData);
          dispatch(updateTeamsSuccess(convertedTeamsData));

          const state = getState() as RootState;
          const { currentDisplayTeam } = state.teamSlice;
          if (!currentDisplayTeam) {
            dispatch(setCurrentDisplayTeam(convertedTeamsData[0]));
          }
        }
      }
    } catch (error) {
      console.error("Error updating team data: ", error);
      dispatch(setTeamRequestStatus("error")); // エラーハンドリングの強化
    }
  }
);
