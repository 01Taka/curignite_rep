import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializableTeamData } from '../../../types/firebase/db/team/teamsTypes';
import { TeamPages } from '../../../pages/app/team/index/TeamIndex';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { updateTeamData } from '../../actions/team/updateTeamData';
import { addAsyncCases, isSuccessfulPayload } from '../../../functions/redux/reduxUtils';

interface TeamSliceState {
    currentDisplayTeam: SerializableTeamData | null;
    displayTeamPage: TeamPages;
    teams: SerializableTeamData[];
    teamsFetchState: AsyncThunkState<SerializableTeamData[]>;
}

const initialState: TeamSliceState = {
    currentDisplayTeam: null,
    displayTeamPage: "participants",
    teams: [],
    teamsFetchState: { state: "idle" },
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
  },
  extraReducers: (builder) => {
    addAsyncCases(builder, updateTeamData, (state, payload) => {
      state.teamsFetchState = payload;
      if (isSuccessfulPayload(payload)) {
        state.teams = payload.value;
      }
    });
  },
});

export const { setCurrentDisplayTeam, setDisplayTeamPage } = TeamSlice.actions;
export default TeamSlice.reducer;
