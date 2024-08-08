import React, { FC, useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { getLastSegment } from '../../../../functions/path/pathUtils';
import TeamChat from '../../../../features/app/team/home/chat/TeamChat';
import { PathParam } from '../../../../types/path/paths';
import { useAppSelector } from '../../../../redux/hooks';
import serviceFactory from '../../../../firebase/db/factory';
import { revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import { JoinState } from '../../../../types/firebase/db/baseTypes';

const TeamHome: FC = () => {
  const params = useParams();
  const teamId = params[PathParam.TeamId];
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);
  const currentTeam = teams[currentTeamId];
  const { uid } = useAppSelector(state => state.userSlice);
  const [joinState, setJoinState] = useState<JoinState>("loading");

  useEffect(() => {
    const updateJoinState = async () => {
      if (uid && teamId) {
        const teamService = serviceFactory.createTeamService();
        const state = await teamService.getSpaceJoinState(uid, teamId, revertTimestampConversion(currentTeam));
        setJoinState(state);
      }
    }
  }, [uid, teamId, currentTeam]);
  
  return (
    <Routes>
      <Route path={getLastSegment(teamPaths.homeChildren.chat)} element={<TeamChat />} />
      <Route path={getLastSegment(teamPaths.homeChildren.participants)} element={<div>参加者</div>} />
      <Route path={getLastSegment(teamPaths.homeChildren.whiteboard)} element={<div>ホワイトボード</div>} />
    </Routes>
  )
}

export default TeamHome