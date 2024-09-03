import React, { FC, useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom';
import { teamPaths } from '../../../../types/path/mainPaths';
import { getLastSegment } from '../../../../functions/path/pathUtils';
import TeamChat from '../../../../features/app/team/home/chat/TeamChat';
import { PathParam } from '../../../../types/path/paths';
import { useAppSelector } from '../../../../redux/hooks';
import serviceFactory from '../../../../firebase/db/factory';
import AccessStateErrorMessage from '../../../../features/utils/messages/AccessStateErrorMessage';
import TeamSetting from '../../../../features/app/team/setting/TeamSetting';
import Participants from './Participants';
import { BaseParticipationStatus } from '../../../../types/firebase/db/baseTypes';
import { CircularProgress } from '@mui/material';

const TeamHome: FC = () => {
  const params = useParams();
  const { uid } = useAppSelector(state => state.userSlice);
  const teamId = params[PathParam.TeamId];
  const [participationStatus, setParticipationStatus] = useState<BaseParticipationStatus | "loading">("loading");

  useEffect(() => {
    const updateParticipationStatus = async () => {
      if (uid && teamId) {
        const teamService = serviceFactory.createTeamService();
        const state = await teamService.getParticipationState(uid, teamId);
        setParticipationStatus(state);
      }
    }
    updateParticipationStatus();
  }, [uid, teamId]);

  const isValidParticipationStatus = (status: BaseParticipationStatus): boolean => {
    return [BaseParticipationStatus.Active, BaseParticipationStatus.Declined].includes(status);
  }
  
  return participationStatus === "loading" ? (
    <CircularProgress />
  ) : isValidParticipationStatus(participationStatus) ? (
    <Routes>
      <Route path={getLastSegment(teamPaths.homeChildren.chat)} element={<TeamChat />} />
      <Route path={getLastSegment(teamPaths.homeChildren.participants)} element={<Participants />} />
      <Route path={getLastSegment(teamPaths.homeChildren.whiteboard)} element={<div>ホワイトボード</div>} />
      <Route path={getLastSegment(teamPaths.homeChildren.setting)} element={<TeamSetting />} />
    </Routes>
  ) : (
    <AccessStateErrorMessage message='このチームへのアクセスは許可されていません。'/>
  );
}

export default TeamHome