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
          dispatch(updateTeamsSuccess(convertTimestampsToNumbers(teamsData)));
          const state = getState() as RootState;
          const { currentDisplayTeam } = state.teamSlice;
          if (!currentDisplayTeam) {
            dispatch(setCurrentDisplayTeam(convertTimestampsToNumbers(teamsData[0])));
          }
        }
      }
    } catch (error) {
      console.error("Error updating team data: ", error);
    }
  }
);
