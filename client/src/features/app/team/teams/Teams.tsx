import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import TeamsList from './TeamsList';
import TeamSkeleton from './TeamSkeleton';
import { mainPaths } from '../../../../types/path/mainPaths';
import { useNavigate } from 'react-router-dom';
import { setCurrentTeamId } from '../../../../redux/slices/team/teamSlice';
import { dictToArrayWithRevertTimestampConversion, revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';

const Teams: FC = () => {
  const userData = useAppSelector(state => state.userSlice);
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setDisplayTeam = (teamId: string) => {
    dispatch(setCurrentTeamId(teamId));

    if (userData.device === "mobile") {
      navigate(mainPaths.team);
    }
  };

  return (
    <>
    <TeamsList
        teamDataList={dictToArrayWithRevertTimestampConversion(teams)}
        uid={userData.uid || ""}
        currentDisplayTeamId={currentTeamId}
        onTeamClick={(data: TeamData) => setDisplayTeam(data.docId)}
      />
    </>
  );
};

export default Teams;
