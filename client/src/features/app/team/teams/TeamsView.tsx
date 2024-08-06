import React, { FC } from 'react';
import { Skeleton } from '@mui/material';
import { TeamsListProps } from '../../../../types/app/teamTypes';
import TeamsList from './TeamsList';
import { RequestStatus } from '../../../../types/util/stateTypes';

interface TeamsViewProps extends TeamsListProps {
  requestState: RequestStatus;
}

const TeamsView: FC<TeamsViewProps> = ({ teamDataList, uid, currentDisplayTeamId, requestState, onTeamClick }) => {
  if (requestState === 'loading' || requestState === "idle") {
    return (
      <div className='w-11/12 mt-8'>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={`skeleton-${index}`} className='rounded-lg my-4' variant="rectangular" height={70} />
        ))}
      </div>
    );
  }

  if (requestState === 'success') {
    return (
      <TeamsList 
        teamDataList={teamDataList}
        uid={uid}
        currentDisplayTeamId={currentDisplayTeamId}
        onTeamClick={onTeamClick}
      />
    );
  }

  return null; // error, notFound, or default
};

export default TeamsView;
