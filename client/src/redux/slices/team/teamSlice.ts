import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeamData } from '../../../types/firebase/db/team/teamsTypes';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { AsyncThunkStatus } from '../../../types/module/redux/asyncThunkTypes';

interface TeamSliceState {
    currentTeamId: string;
    teams: TimestampConvertedDocumentMap<TeamData>;
    teamsUpdateState: AsyncThunkStatus,
}

const initialState: TeamSliceState = {
    currentTeamId: "",
    teams: {},
    teamsUpdateState: "idle",
};

const TeamSlice = createSlice({
  name: 'teamSlice',
  initialState,
  reducers: {
    setCurrentTeamId: (state, action: PayloadAction<string>) => {
        state.currentTeamId = action.payload;
    },
    setTeams: (state, action: PayloadAction<TimestampConvertedDocumentMap<TeamData>>) => {
      state.teams = action.payload;
    },
    setTeamsUpdateState: (state, action: PayloadAction<AsyncThunkStatus>) => {
      state.teamsUpdateState = action.payload;
    }
  },
});

export const { setCurrentTeamId, setTeams, setTeamsUpdateState } = TeamSlice.actions;
export default TeamSlice.reducer;
