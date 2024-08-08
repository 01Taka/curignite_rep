import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import { setCurrentDisplayTeam } from '../../../../redux/slices/team/teamSlice';
import { useNavigate } from 'react-router-dom';
import { convertTimestampsToNumbers, revertTimestampConversion } from '../../../../functions/db/dbUtils';
import TeamsList from './TeamsList';
import TeamSkeleton from './TeamSkeleton';
import { mainPaths } from '../../../../types/path/mainPaths';

const Teams: FC = () => {
  const userData = useAppSelector(state => state.userSlice);
  const { teams, currentDisplayTeam, teamsFetchState } = useAppSelector(state => state.teamSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setDisplayTeam = (team: TeamData) => {
    dispatch(setCurrentDisplayTeam(convertTimestampsToNumbers(team)));
    
    if (userData.device === "mobile") {
      navigate(mainPaths.team);
    }
  };

  return (
    <>
    {teamsFetchState.state === "success" &&
      <TeamsList
        teamDataList={revertTimestampConversion(teams)}
        uid={userData.uid || ""}
        currentDisplayTeamId={currentDisplayTeam?.docId}
        onTeamClick={setDisplayTeam}
      />
    }
    {(teamsFetchState.state === "loading" || teamsFetchState.state === "idle") && 
      <TeamSkeleton />
    }
    </>
  );
};

export default Teams;
