import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializableTeamData } from '../../types/firebase/db/teamsTypes';
import { TeamPages } from '../../pages/app/team/index/TeamIndex';
import { TeamRequestStatus } from '../../types/app/teamTypes';

interface TeamSliceState {
    currentDisplayTeam: SerializableTeamData | null;
    displayTeamPage: TeamPages;
    teams: SerializableTeamData[];
    requestState: TeamRequestStatus;
}

const initialState: TeamSliceState = {
    currentDisplayTeam: null,
    displayTeamPage: "participants",
    teams: [],
    requestState: "loading",
};

const TeamSlice = createSlice({
  name: 'teamSlice',
  initialState,
  reducers: {
    setCurrentDisplayTeam: (state, action: PayloadAction<SerializableTeamData | null>) => {
        state.currentDisplayTeam = action.payload;
    },
    setDisplayTeamPage: (state, action: PayloadAction<TeamPages>) => {
      state.displayTeamPage = action.payload;
    },
    updateTeamsSuccess: (state, action: PayloadAction<SerializableTeamData[]>) => {
      state.requestState = "success";
      state.teams = action.payload;
    },
    setTeamRequestStatus: (state, action: PayloadAction<TeamRequestStatus>) => {
      state.requestState = action.payload;
    },
    updateTeams: (state, action: PayloadAction<SerializableTeamData[]>) => {
      state.requestState = "success";
      state.teams = action.payload;
    },
    setTeamsNotFound: (state) => {
      state.requestState = "notFound";
      state.teams = [];
    }
  },
});

export const { setCurrentDisplayTeam, setDisplayTeamPage, updateTeamsSuccess, updateTeams, setTeamRequestStatus, setTeamsNotFound } = TeamSlice.actions;
export default TeamSlice.reducer;
