import { Dispatch } from '@reduxjs/toolkit';
import serviceFactory from '../../../firebase/db/factory';
import { setTeams, setTeamsUpdateState } from '../../slices/team/teamSlice';
import store from '../../store';
import { autoUpdateCollection } from '../../../functions/redux/reduxUtils';
import { AppDispatch } from '../../../types/module/redux/reduxTypes';
import { teamPaths } from '../../../types/path/mainPaths';
import { NavigateFunction } from 'react-router-dom';
import { replaceParams } from '../../../functions/path/pathUtils';
import { PathParam } from '../../../types/path/paths';
import { arrayToDictWithTimestampToNumbers, convertTimestampsToNumbers } from '../../../functions/db/dataFormatUtils';
import { TeamData, TeamWithSupplementary } from '../../../types/firebase/db/team/teamStructure';
import { AsyncThunkStatus } from '../../../types/module/redux/asyncThunkTypes';
import { objectArrayToDict } from '../../../functions/objectUtils';
import { DocumentIdMap } from '../../../types/firebase/db/formatTypes';

export const setApprovedTeams = async (dispatch: AppDispatch, uid: string) => { // TODO 安全性を高めるためのエラーハンドリングなどを追加
  try {
    const teamService = serviceFactory.createTeamService()
    const teams = await teamService.fetchApprovedTeams(uid);
    const fullTeams = await teamService.addSupplementaryToTeams(teams);
    const teamMap = objectArrayToDict(fullTeams, "docId") as DocumentIdMap<TeamWithSupplementary>;
    dispatch(setTeams(convertTimestampsToNumbers(teamMap)));
  } catch (error) {
    console.error('Error fetching approved teams:', error);
  }
}

/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
const autoUpdateTeams = (dispatch: Dispatch, userId: string) => {
  try {
    const teamService = serviceFactory.createTeamService();
    const teamMemberService = serviceFactory.createTeamMemberService();

    const setFunc = async (updatedData: TeamData[]) => {
      const prevData = store.getState().teamSlice.teams;
      const fullTeams = await teamService.addSupplementaryToTeams(updatedData);
      const newData = arrayToDictWithTimestampToNumbers(fullTeams);
      
      // データに変更がある場合のみ更新
      if (JSON.stringify(prevData) !== JSON.stringify({...prevData, ...newData})) {
        return setTeams({ ...prevData, ...newData });
      }

      // データに変更がない場合は何もしない
      return null;
    }

    autoUpdateCollection<TeamData>(
      teamService.baseDB,
      userId,
      teamMemberService.filterNonMemberTeam.bind(teamMemberService),
      setFunc,
      setTeamsUpdateState,
      dispatch
    );
  } catch (error) {
    console.error("Error in autoUpdateTeams:", error);
    dispatch(setTeamsUpdateState(AsyncThunkStatus.ERROR));
  }
};

export const navigateToTeamHome = (teamId: string, dispatch: AppDispatch, navigate: NavigateFunction, path: string = teamPaths.homeChildren.participants) => {
  console.log("nav", teamId, path);

  navigate(replaceParams(path, { [PathParam.TeamId]: teamId }));
}