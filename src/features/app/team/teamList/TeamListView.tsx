import React, { FC } from 'react';
import { Skeleton } from '@mui/material';
import { TeamData } from '../../../../types/firebase/db/teamsTypes';
import TeamContainer from './TeamContainer';
import { countActiveMember } from '../../../../firebase/db/app/team/teamDBUtil';
import { RequestStatus } from '../../../../types/util/stateTypes';

interface TeamListViewProps {
  teamDataList: TeamData[];
  uid: string;
  currentDisplayTeamId: string | undefined;
  requestState: RequestStatus;
  onTeamClick: (team: TeamData) => void;
}

const TeamListView: FC<TeamListViewProps> = ({ teamDataList, uid, currentDisplayTeamId, requestState, onTeamClick }) => {
  switch (requestState) {
    case "loading":
      return (
        <div className='w-11/12 mt-8'>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={`skeleton-${index}`} className='rounded-lg my-4' variant="rectangular" height={70} />
          ))}
        </div>
      );
    case "success":
      return (
        <div className='flex flex-col items-center w-full mt-8'>
          {teamDataList.map((team) => (
            <div className='w-11/12 my-2' key={team.documentId} onClick={() => onTeamClick(team)}>
              <TeamContainer
                teamName={team.teamName}
                iconPath={team.iconPath}
                participantsName={team.participantsName}
                myTeam={team.authorUid === uid}
                currentDisplay={team.documentId === currentDisplayTeamId}
                participantsNumber={countActiveMember(team.roles)}
              />
            </div>
          ))}
        </div>
      );
    case "error":
    case "notFound":
    default:
      return null;
  }
};

export default TeamListView;
