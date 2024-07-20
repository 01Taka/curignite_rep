import React, { FC, useEffect, useState } from 'react'
import TeamListView from './TeamListView';
import { useAppSelector } from '../../../../../redux/hooks';
import { UserTeamInfo } from '../../../../../firebase/db/app/user/usersTypes';
import { initialTeamInfoState, TeamInfo } from '../../../../../firebase/db/app/team/teamsTypes';
import { usersDB } from '../../../../../firebase/db/dbs';
import { getTeamsFromUserTeamsInfo } from '../../../../../firebase/db/app/team/teamDBUtil';

const TeamList: FC = () => {
  const userData = useAppSelector(state => state.userDataSlice)
  const [userTeamsInfo, setUserTeamsInfo] = useState<UserTeamInfo[]>([]);
  const [temporaryTeamInfoList, setTemporaryTeamInfoList] = useState<TeamInfo[]>([]);
  const [teamInfoList, setTeamInfoList] = useState<TeamInfo[]>([]);

  useEffect(() => {
    const updateUserTeamsInfo = async() => {
      const uid = userData.uid
      if (uid) {
        const userTeamsInfo = await usersDB.getAllUserTeamsInfo(uid);
        setUserTeamsInfo(userTeamsInfo);
        const temporaryTeamInfoList: TeamInfo[] = userTeamsInfo.map(value => {
          const temporaryTeamInfo: TeamInfo = {
            ...initialTeamInfoState,
            teamName: value.teamName,
            iconPath: value.teamIconPath,
          }
          return temporaryTeamInfo;
        })
        setTemporaryTeamInfoList(temporaryTeamInfoList);
      }
    }
    updateUserTeamsInfo();
  }, [userData])

  useEffect(() => {
    const updateTeamInfo = async() => {
      const uid = userData.uid
      if (uid && userTeamsInfo.length > 0) {
        const teamsInfo = await getTeamsFromUserTeamsInfo(uid, userTeamsInfo);
        setTeamInfoList(teamsInfo);
      }
    };
    updateTeamInfo();
  }, [userData, userTeamsInfo])

  return <TeamListView
    teamInfoList={teamInfoList.length > 0 ? teamInfoList : temporaryTeamInfoList}
    uid={userData.uid || ""}
    loading={temporaryTeamInfoList.length === 0 && teamInfoList.length === 0}
  />
}

export default TeamList