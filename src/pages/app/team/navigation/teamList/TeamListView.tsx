import React, { FC } from 'react'

import { Skeleton } from '@mui/material';
import { TeamInfo } from '../../../../../firebase/db/app/team/teamsTypes';
import TeamContainer from './TeamListItem';
import { getParticipantsNumber } from '../../../../../firebase/db/app/team/teamDBUtil';

interface TeamListViewProps {
  teamInfoList: TeamInfo[];
  uid: string;
  loading: boolean;
}

const TeamListView: FC<TeamListViewProps> = ({ teamInfoList, uid, loading }) => {
  return (
    <div className='flex flex-col'>
      {!loading ?
        <>
          {teamInfoList.map((info, index) => (
            <div className='my-4'>
              <TeamContainer
                key={index}
                teamName={info.teamName}
                iconPath={info.iconPath}
                participantsName={info.participantsName}
                myTeam={info.authorUid === uid}
                participantsNumber={getParticipantsNumber(info.roles)}
              />
            </div>
          ))}
        </>
      :
        <div className='my-4'>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className='rounded-lg my-4' variant="rectangular" width={384} height={72} />
          ))}
        </div>
      }
    </div>
  )
}

export default TeamListView