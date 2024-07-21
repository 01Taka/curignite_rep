import React, { FC } from 'react'

import { Skeleton } from '@mui/material';
import { TeamInfo } from '../../../../../types/firebase/db/teamsTypes';
import TeamContainer from './TeamListItem';
import { getParticipantsNumber } from '../../../../../firebase/db/app/team/teamDBUtil';

interface TeamListViewProps {
  teamInfoList: TeamInfo[];
  uid: string;
  loading: boolean;
  onTeamClick: (team: TeamInfo) => void;
}

const TeamListView: FC<TeamListViewProps> = ({ teamInfoList, uid, loading, onTeamClick }) => {
  return (
    <div className='flex flex-col items-center w-full'>
      {!loading ?
        <>
          {teamInfoList.map((team, index) => (
            <div className='w-11/12 my-4' key={index} onClick={() => onTeamClick(team)}>
              <TeamContainer
                teamName={team.teamName}
                iconPath={team.iconPath}
                participantsName={team.participantsName}
                myTeam={team.authorUid === uid}
                participantsNumber={getParticipantsNumber(team.roles)}
              />
            </div>
          ))}
        </>
      :
        <div className='w-11/12'>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={`skeleton-${index}`} className='rounded-lg my-4' variant="rectangular" height={70} />
          ))}
        </div>
      }
    </div>
  )
}

export default TeamListView