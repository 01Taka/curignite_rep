import { Dispatch } from '@reduxjs/toolkit';
import serviceFactory from '../../../firebase/db/factory';
import { TeamData } from '../../../types/firebase/db/team/teamsTypes';
import { setCurrentTeamId, setTeams, setTeamsUpdateState } from '../../slices/team/teamSlice';
import store from '../../store';
import { autoUpdateCollection } from '../../../functions/redux/reduxUtils';
import { AppDispatch } from '../../../types/module/redux/reduxTypes';
import { teamPaths } from '../../../types/path/mainPaths';
import { NavigateFunction } from 'react-router-dom';
import { replaceParams } from '../../../functions/path/pathUtils';
import { PathParam } from '../../../types/path/paths';
import { arrayToDictWithTimestampToNumbers } from '../../../functions/db/dataFormatUtils';
/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const autoUpdateTeams = (dispatch: Dispatch, userId: string) => {
  const teamService = serviceFactory.createTeamService();
  const teamMemberService = serviceFactory.createTeamMemberService();

  const setFunc = (updatedData: TeamData[]) => {
    const prevData = store.getState().teamSlice.teams;
    const newData = arrayToDictWithTimestampToNumbers(updatedData);
    return setTeams({...prevData, ...newData});
  }

  autoUpdateCollection<TeamData>(
    teamService.baseDB,
    userId,
    teamMemberService.filterNonMemberTeam.bind(teamMemberService),
    setFunc,
    setTeamsUpdateState,
    dispatch
  );
};

export const navigateToTeamHome = (teamId: string, dispatch: AppDispatch, navigate: NavigateFunction, path: string = teamPaths.homeChildren.participants) => {
  console.log("nav", teamId, path);
  
  dispatch(setCurrentTeamId(teamId));
  navigate(replaceParams(path, { [PathParam.TeamId]: teamId }));
}