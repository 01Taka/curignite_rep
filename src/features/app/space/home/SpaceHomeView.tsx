import React, { FC } from 'react';
import SpaceTimer from './SpaceTimer';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';

interface SpaceHomeViewProps {
  space: SpaceData | null;
}

const SpaceHomeView: FC<SpaceHomeViewProps> = ({ space }) => {
  return (
    <div>
      <SpaceTimer pomodoro={{cycle: 10000, break: 5000}}/>
    </div>
  )
};

export default SpaceHomeView;