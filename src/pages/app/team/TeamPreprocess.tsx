import React, { useEffect } from 'react';
import { getTeamsFromUserTeamsInfo } from "../../../firebase/db/app/team/teamDBUtil";
import { initialTeamInfoState, TeamInfo } from "../../../types/firebase/db/teamsTypes";
import { usersDB } from "../../../firebase/db/dbs";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setCurrentDisplayTeam, setTeams } from "../../../redux/slices/teamSlice";
import { serializeTeamInfo, serializeTeamInfoArray } from '../../../functions/serialization/team/teamSerialization';

const TeamPreprocess = () => {
  const userData = useAppSelector(state => state.userDataSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateTeamInfo = async () => {
      try {
        const uid = userData.uid;
        if (uid) {
          const userTeamsInfo = await usersDB.getAllUserTeamsInfo(uid);
          const temporaryTeamInfoList: TeamInfo[] = userTeamsInfo.map(value => {
            const temporaryTeamInfo: TeamInfo = {
              ...initialTeamInfoState,
              teamName: value.teamName,
              iconPath: value.teamIconPath,
            };
            return temporaryTeamInfo;
          });

          // reduxに仮チーム情報を登録
          dispatch(setTeams(serializeTeamInfoArray(temporaryTeamInfoList)));

          const teamsInfo = await getTeamsFromUserTeamsInfo(uid, userTeamsInfo);

          // reduxにチーム情報を設定
          dispatch(setTeams(serializeTeamInfoArray(teamsInfo)));
          dispatch(setCurrentDisplayTeam(serializeTeamInfo(teamsInfo[0])));
        }
      } catch (error) {
        console.error("Error updating team info: ", error);
      }
    };

    updateTeamInfo();
  }, [dispatch, userData.uid]); // userData.uidが変わったときのみ再実行される

  return null; // 何も表示しない
};

export default TeamPreprocess;
