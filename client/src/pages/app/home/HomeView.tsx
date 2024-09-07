import React, { FC, useState } from 'react';
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

interface HomeViewProps {}

interface StartLearningButtonProps {
  onClick: () => void;
} 

const StartLearningButton: FC<StartLearningButtonProps> = ({ onClick }) => (
  <div className='fixed flex justify-center bottom-8 w-full'>
    <div className='relative'>
      <div className='absolute inset-0 flex justify-center items-center w-full h-full'>
        <button
          className='w-36 h-36 bg-lime-400 hover:bg-lime-500 shadow-md rounded-full z-10 transition-all duration-300 hover:scale-110'
          onClick={onClick}
        >
          <div className='text-2xl font-bold'>学習を開始</div>
        </button>
      </div>
      <img
        src='images/components/tower.png'
        alt='ダンジョン入口'
        className='w-auto h-80 rounded-3xl opacity-60 blur-sm'
      />
    </div>
  </div>
);

const FixedSideContent: FC = () => {
  const userData = useAppSelector(state => state.userSlice.userData);
  
  return (
    <div className='fixed top-6 right-6'>
    <UserProfileCard userData={userData ? revertTimestampConversion(userData) : null} />
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
    <div className='fixed top-40 left-6'>
      <LearningSessions />
      <Goals />
    </div>
  )
}

const HomeView: FC<HomeViewProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <StartLearningButton onClick={() => setOpen(true)} />
      <FixedSideContent />
      <FixedNavigateButtons />
      <FixedInfo />
      <StartSessionPopup open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default HomeView;
