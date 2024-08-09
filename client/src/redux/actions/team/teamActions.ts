import { Dispatch } from '@reduxjs/toolkit';
import serviceFactory from '../../../firebase/db/factory';
import { TeamData } from '../../../types/firebase/db/team/teamsTypes';
import { setTeams, setTeamsUpdateState } from '../../slices/team/teamSlice';
import store from '../../store';
import { autoUpdateCollection } from '../../../functions/redux/reduxUtils';
/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const autoUpdateTeams = (dispatch: Dispatch, userId: string) => {
  const teamsDB = serviceFactory.getTeamsDB();
  const teamService = serviceFactory.createTeamService();

  autoUpdateCollection<TeamData>(
    teamsDB,
    userId,
    teamService.filterTeamsByUserId.bind(teamService),
    setTeams,
    setTeamsUpdateState,
    () => store.getState().teamSlice.teams,
    dispatch
  );
};