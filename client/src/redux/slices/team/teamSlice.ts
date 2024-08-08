import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeamData } from '../../../types/firebase/db/team/teamsTypes';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';

interface TeamSliceState {
    currentTeamId: string;
    teams: TimestampConvertedDocumentMap<TeamData>;
}

const initialState: TeamSliceState = {
    currentTeamId: "",
    teams: {},
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
  },
});

export const { setCurrentTeamId, setTeams } = TeamSlice.actions;
export default TeamSlice.reducer;
