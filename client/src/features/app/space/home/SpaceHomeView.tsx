import React, { FC } from 'react';
import SpaceTimer from './timer/SpaceTimer';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import Calendar from '../../../../components/app/calendar/Calendar';
import { Grid } from '@mui/material';
import LearningSummary from './learningData/LearningSummary';

interface SpaceHomeViewProps {
  space: SpaceData;
}

const SpaceHomeView: FC<SpaceHomeViewProps> = ({ space }) => {
  return (
    <Grid
      container
      spacing={2} // MUIのGrid間のスペース
      className="h-screen p-4" // Tailwind CSSを適用
    >
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bg-gray-200">
        1
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bg-gray-300">
        <SpaceTimer spaceId={space.docId}/>
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bg-gray-400">
        <Calendar />
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bg-gray-500">
        4
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bg-gray-600">
        5
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bg-gray-700">
        <LearningSummary />
      </Grid>
    </Grid>
  );

};

export default SpaceHomeView;