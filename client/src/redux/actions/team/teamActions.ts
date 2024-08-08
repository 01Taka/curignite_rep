import { Dispatch } from '@reduxjs/toolkit';
import { arrayToDictWithTimestampToNumbers } from '../../../functions/db/dataFormatUtils';
import serviceFactory from '../../../firebase/db/factory';
import { TeamData } from '../../../types/firebase/db/team/teamsTypes';
import { setTeams } from '../../slices/team/teamSlice';

/**
 * ユーザーの所属チーム情報を自動更新する関数
 * @param dispatch - Reduxのdispatch関数
 * @param userId - ユーザーID
 */
export const autoUpdateTeams = (dispatch: Dispatch, userId: string) => {
  try {
    const teamsDB = serviceFactory.getTeamsDB();
    const teamService = serviceFactory.createTeamService();

    /**
     * コールバック関数：ユーザーが所属するチーム情報をフィルタリングし、Reduxストアに更新します
     * @param teams - チームデータの配列
     */
    const callback = (teams: TeamData[]) => {
      const belongingTeams = teamService.filterTeamsByUserId(userId, teams);
      const teamsDict = arrayToDictWithTimestampToNumbers(belongingTeams);
      dispatch(setTeams(teamsDict));
    };

    teamsDB.addTeamCollectionCallback(callback);
  } catch (error) {
    console.error("Failed to auto-update teams:", error);
  }
};