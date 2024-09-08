import React, { FC, useCallback, useEffect, useState } from 'react';
import LearningOverview from '../../../features/app/learning/LearningOverview';
import LearningTimeHeatmap from '../../../features/app/learning/LearningTimeHeatmap';
import ImageButton from '../../../components/input/button/ImageButton';
import UserProfileCard from '../../../features/app/user/UserProfileCard';
import StartSessionPopup from '../../../features/app/learning/StartSessionPopup';
import LearningSessions from '../../../features/app/learning/LearningSessions';
import Goals from '../../../features/app/goal/Goals';
import { useNavigate } from 'react-router-dom';
import { mainPaths } from '../../../types/path/mainPaths';
import { useAppSelector } from '../../../redux/hooks';
import { revertTimestampConversion } from '../../../functions/db/dataFormatUtils';
import Helps from '../../../features/app/help/Helps';
import StartLearningButton from '../../../features/app/learning/StartLearningButton';

interface HomeViewProps {}

const FixedSideContent: FC = () => {
  const userData = useAppSelector(state => state.userSlice.userData);
  
  return (
    <div className='fixed top-6 right-6 max-w-sm'>
    <UserProfileCard userData={userData ? revertTimestampConversion(userData) : null} shadow />
    <LearningOverview />
    <LearningTimeHeatmap />
  </div>
  )
}

const FixedNavigateButtons: FC = () => {
  return (
    <div className='fixed top-6 left-6 flex items-center'>
      <NavigateButton src='images/components/team.png' label='学習チーム' navigatePath={mainPaths.team} />
      <NavigateButton src='images/components/member.png' label='学習中メンバー' navigatePath={mainPaths.activeMember} />
      <NavigateButton src='images/components/partner.png' label='学習パートナー' navigatePath={mainPaths.partner} />
    </div>
  )
}

interface NavigateButtonProps {
  src: string;
  label: string;
  navigatePath: string;
}

const NavigateButton: FC<NavigateButtonProps> = ({ src, label, navigatePath }) => {
  const navigate = useNavigate();
  return <ImageButton src={src} alt={label} label={label} size="lg" textSize="md" shape="square" onClick={() => navigate(navigatePath)}/>
}

const FixedInfo: FC = () => {
  return (
    <div className='fixed top-40 left-6 max-w-sm'>
      <LearningSessions />
      <Goals />
      <Helps />
    </div>
  )
}

const HomeView: FC<HomeViewProps> = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <StartLearningButton onClickAtNotLearning={() => setOpen(true)} onClickAtLearning={() => navigate(mainPaths.focusLearning)}/>
      <FixedSideContent />
      <FixedNavigateButtons />
      <FixedInfo />
      <StartSessionPopup open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default HomeView;
