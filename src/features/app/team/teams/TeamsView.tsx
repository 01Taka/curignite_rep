import React, { FC } from 'react';
import { Skeleton } from '@mui/material';
import { TeamRequestStatus, TeamsListProps } from '../../../../types/app/teamTypes';
import TeamsList from './TeamsList';

interface TeamsViewProps extends TeamsListProps {
  requestState: TeamRequestStatus;
}

const TeamsView: FC<TeamsViewProps> = ({ teamDataList, uid, currentDisplayTeamId, requestState, onTeamClick }) => {
  switch (requestState) {
    case "loading":
      return (
        <div className='w-11/12 mt-8'>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={`skeleton-${index}`} className='rounded-lg my-4' variant="rectangular" height={70} />
          ))}
        </div>
      );
    case "temporary":
    case "success":
      return <TeamsList 
        teamDataList={teamDataList}
        uid={uid}
        currentDisplayTeamId={currentDisplayTeamId}
        hideTeamsWithoutIds={requestState === "success"}
        onTeamClick={onTeamClick}
      />
    case "error":
    case "notFound":
    default:
      return null;
  }
};

export default TeamsView;
