import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApprovedTeamsFromUserData } from "../../../firebase/db/app/team/teamDBUtil";
import { initialTeamDataState, TeamData } from "../../../types/firebase/db/teamsTypes";
import { usersDB } from "../../../firebase/db/dbs";
import { setCurrentDisplayTeam, setTeamsNotFound, updateTeams, updateTeamsSuccess } from "../../slices/teamSlice";
import { serializeTeamData, serializeTeamDataArray } from '../../../functions/serialization/team/teamSerialization';
import { RootState } from '../../../types/module/reduxTypes';

export const updateTeamData = createAsyncThunk<void, string>(
  'teams/updateTeamData',
  async (uid, { dispatch, getState }) => {
    try {
      if (uid) {
        const userTeamsData = await usersDB.getAllUserTeamsData(uid);

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

        const teamsData = await fetchApprovedTeamsFromUserData(uid, userTeamsData);

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
