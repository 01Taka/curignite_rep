import { createAsyncThunk } from '@reduxjs/toolkit';
import { getParticipatingTeamsByUid } from "../../../firebase/db/app/team/teamsDBUtil";
import { initialTeamDataState, TeamData } from "../../../types/firebase/db/team/teamsTypes";
import { setCurrentDisplayTeam, setTeamRequestStatus, setTeamsNotFound, updateTeams, updateTeamsSuccess } from "../../slices/teamSlice";
import { serializeTeamData, serializeTeamDataArray } from '../../../functions/serialization/team/teamSerialization';
import { RootState } from '../../../types/module/redux/reduxTypes';
import { getAllUserTeams } from '../../../firebase/db/app/user/subCollection/userTeamService';

export const updateTeamData = createAsyncThunk<void, string>(
  'teams/updateTeamData',
  async (uid, { dispatch, getState }) => {
    try {
      if (uid) {
        dispatch(setTeamRequestStatus("loading"));

        const userTeamsData = await getAllUserTeams(uid);

        if (userTeamsData.length === 0) {
          dispatch(setTeamsNotFound());
          return;
        }

        const temporaryTeamDataList: TeamData[] = userTeamsData.map(value => ({
          ...initialTeamDataState,
          teamName: value.teamName,
          iconPath: value.teamIconPath,
        }));

        dispatch(updateTeams(serializeTeamDataArray(temporaryTeamDataList)));
        dispatch(setTeamRequestStatus("temporary"));

        const teamsData = await getParticipatingTeamsByUid(uid, userTeamsData);

        if (teamsData.length === 0) {
          dispatch(setTeamsNotFound());
        } else {
          dispatch(updateTeamsSuccess(serializeTeamDataArray(teamsData)));
          const state = getState() as RootState;
          const { currentDisplayTeam } = state.teamSlice;
          if (!currentDisplayTeam) {
            dispatch(setCurrentDisplayTeam(serializeTeamData(teamsData[0])));
          }
        }
      }
    } catch (error) {
      console.error("Error updating team data: ", error);
    }
  }
);
