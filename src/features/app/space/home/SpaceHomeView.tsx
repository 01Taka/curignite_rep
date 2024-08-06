import React, { FC } from 'react';
import SpaceTimer from './SpaceTimer';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import Calendar from '../../../../components/app/calendar/Calendar';

interface SpaceHomeViewProps {
  space: SpaceData;
}

const SpaceHomeView: FC<SpaceHomeViewProps> = ({ space }) => {
  return (
    <div>
      <Calendar />
      <SpaceTimer spaceId={space?.docId} pomodoro={{cycle: 10000, break: 5000}}/>
    </div>
  )
};

export default SpaceHomeView;