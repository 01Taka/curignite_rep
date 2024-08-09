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
import TeamAccessError from '../../../../features/app/team/home/TeamAccessError';

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
      <Route path={getLastSegment(teamPaths.homeChildren.participants)} element={<div>参加者</div>} />
      <Route path={getLastSegment(teamPaths.homeChildren.whiteboard)} element={<div>ホワイトボード</div>} />
    </Routes>
  ) : (
    <TeamAccessError joinState={joinState} />
  );
}

export default TeamHome