import React, { FC } from 'react';
import SpaceTimer from './timer/SpaceTimer';
import { Grid } from '@mui/material';
import LearningSummary from './learningData/LearningSummary';
import FinishLearning from './finishLearning/FinishLearning';
import { getCurrentSessionSpaceId } from '../../../../functions/app/space/learningSessionUtils';
import SpaceHeatmap from './heatmap/SpaceHeatmap';
import ActionIndex from './actions/ActionIndex';

interface SpaceHomeViewProps {};

const SpaceHomeView: FC<SpaceHomeViewProps> = () => {
  return (
    <Grid
      container
      spacing={2} // MUIのGrid間のスペース
      className="h-screen p-4" // Tailwind CSSを適用
    >
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-200">
        <ActionIndex />
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-300">
        <SpaceTimer spaceId={getCurrentSessionSpaceId() ?? ""}/>
      </Grid>
      <Grid item xs={4} className="flex items-center justify-center h-1/2 bggray-400">
        <SpaceHeatmap />
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