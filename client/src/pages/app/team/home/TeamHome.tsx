import React, { FC, useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { getLastSegment } from '../../../../functions/path/pathUtils';
import TeamChat from '../../../../features/app/team/home/chat/TeamChat';
import { PathParam } from '../../../../types/path/paths';
import { useAppSelector } from '../../../../redux/hooks';
import serviceFactory from '../../../../firebase/db/factory';
import { JoinState } from '../../../../types/firebase/db/baseTypes';
import { isApprovedJoinState } from '../../../../functions/db/dbUtils';
import AccessStateErrorMessage from '../../../../features/utils/messages/AccessStateErrorMessage';
import TeamSetting from '../../../../features/app/team/setting/TeamSetting';
import Participants from './Participants';

const TeamHome: FC = () => {
  const params = useParams();
  const { uid } = useAppSelector(state => state.userSlice);
  const teamId = params[PathParam.TeamId];
  const [joinState, setJoinState] = useState<JoinState>("loading");

  useEffect(() => {
    const updateJoinState = async () => {
      if (uid && teamId) {
        const teamService = serviceFactory.createTeamService();
        const state = await teamService.getSpaceJoinState(uid, teamId);
        setJoinState(state);
      }
    }
    updateJoinState();
  }, [uid, teamId]);
  
  return isApprovedJoinState(joinState) ? (
    <Routes>
      <Route path={getLastSegment(teamPaths.homeChildren.chat)} element={<TeamChat />} />
      <Route path={getLastSegment(teamPaths.homeChildren.participants)} element={<Participants />} />
      <Route path={getLastSegment(teamPaths.homeChildren.whiteboard)} element={<div>ホワイトボード</div>} />
      <Route path={getLastSegment(teamPaths.homeChildren.setting)} element={<TeamSetting />} />
    </Routes>
  ) : (
    <AccessStateErrorMessage joinState={joinState} message='このチームへのアクセスは許可されていません。'/>
  );
}

export default TeamHome