import React, { FC, useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { getLastSegment } from '../../../../functions/path/pathUtils';
import TeamChat from '../../../../features/app/team/home/chat/TeamChat';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import TeamSetting from '../../../../features/app/team/setting/TeamSetting';
import Participants from './Participants';
import TeamParticipationCheck from '../../../../features/app/team/utils/TeamParticipationCheck';
import { setCurrentTeamId } from '../../../../redux/slices/team/teamSlice';
import { PathParam } from '../../../../types/path/paths';

const TeamHome: FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const teamId = useAppSelector(state => state.teamSlice.currentTeamId);
  const uid = useAppSelector(state => state.userSlice.uid);

  useEffect(() => {
    dispatch(setCurrentTeamId(params[PathParam.TeamId] || ""));
  }, [params, dispatch])

  return (
    <TeamParticipationCheck uid={uid} teamId={teamId || null}>
      <Routes>
        <Route path={getLastSegment(teamPaths.homeChildren.chat)} element={<TeamChat />} />
        <Route path={getLastSegment(teamPaths.homeChildren.participants)} element={<Participants />} />
        <Route path={getLastSegment(teamPaths.homeChildren.whiteboard)} element={<div>ホワイトボード</div>} />
        <Route path={getLastSegment(teamPaths.homeChildren.setting)} element={<TeamSetting />} />
      </Routes>
    </TeamParticipationCheck>
  );
};

export default TeamHome;
