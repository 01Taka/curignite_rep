import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { AsyncThunkStatus } from '../../../types/module/redux/asyncThunkTypes';
import { TeamWithSupplementary } from '../../../types/firebase/db/team/teamStructure';

interface TeamSliceState {
    currentTeamId: string;
    teams: TimestampConvertedDocumentMap<TeamWithSupplementary>;
    teamsUpdateState: AsyncThunkStatus,
}

const initialState: TeamSliceState = {
    currentTeamId: "",
    teams: {},
    teamsUpdateState: AsyncThunkStatus.IDLE,
};

const TeamSlice = createSlice({
  name: 'teamSlice',
  initialState,
  reducers: {
    setCurrentTeamId: (state, action: PayloadAction<string>) => {
        state.currentTeamId = action.payload;
    },
    setTeams: (state, action: PayloadAction<TimestampConvertedDocumentMap<TeamWithSupplementary>>) => {
      state.teams = action.payload;
    },
    setTeamsUpdateState: (state, action: PayloadAction<AsyncThunkStatus>) => {
      state.teamsUpdateState = action.payload;
    }
  },
});

export const { setCurrentTeamId, setTeams, setTeamsUpdateState } = TeamSlice.actions;
export default TeamSlice.reducer;
