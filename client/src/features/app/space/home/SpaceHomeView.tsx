import React, { FC } from 'react';
import SpaceTimer from './timer/SpaceTimer';
import { SpaceData } from '../../../../types/firebase/db/space/spacesTypes';
import Calendar from '../../../../components/app/calendar/Calendar';
import { Grid } from '@mui/material';
import LearningSummary from './learningData/LearningSummary';
import FinishLearning from './finishLearning/FinishLearning';
import { useAppSelector } from '../../../../redux/hooks';
import { getCurrentSessionSpaceId } from '../../../../functions/app/space/learningSessionUtils';

interface SpaceHomeViewProps {
  space: SpaceData;
}

const SpaceHomeView: FC<SpaceHomeViewProps> = ({ space }) => {
  const { spaceId } = useAppSelector(state => state.learningSessionSlice);
  return (
    <Grid
      container
      spacing={2} // MUIのGrid間のスペース
      className="h-screen p-4" // Tailwind CSSを適用
    >
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-200">
        1
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-300">
        <SpaceTimer spaceId={getCurrentSessionSpaceId() ?? ""}/>
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-400">
        <Calendar />
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-500">
        4
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-600">
        5
      </Grid>
      <Grid item xs={4} className="flex items-start justify-around h-1/2 bggray-700">
        <LearningSummary />
        <FinishLearning />
      </Grid>
    </Grid>
  );

};

export default SpaceHomeView;