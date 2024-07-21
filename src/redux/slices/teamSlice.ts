import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializableTeamInfo } from '../../types/firebase/db/teamsTypes';

interface TeamSliceState {
    currentDisplayTeam: SerializableTeamInfo | null;
    teams: SerializableTeamInfo[];
}

const initialState: TeamSliceState = {
    currentDisplayTeam: null,
    teams: [],
};

const TeamSlice = createSlice({
  name: 'teamSlice',
  initialState,
  reducers: {
    setCurrentDisplayTeam: (state, action: PayloadAction<SerializableTeamInfo>) => {
        state.currentDisplayTeam = action.payload
    },
    setTeams: (state, action: PayloadAction<SerializableTeamInfo[]>) => {
      state.teams = action.payload
    }
  },
});

export const { setCurrentDisplayTeam, setTeams } = TeamSlice.actions;
export default TeamSlice.reducer;
