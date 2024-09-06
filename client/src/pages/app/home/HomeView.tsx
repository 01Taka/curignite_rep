import React, { FC, useState } from 'react';
import LearningOverview from '../../../features/app/learning/LearningOverview';
import LearningTimeHeatmap from '../../../features/app/learning/LearningTimeHeatmap';
import ImageButton from '../../../components/input/button/ImageButton';
import UserProfileCard from '../../../features/app/user/UserProfileCard';
import StartSessionPopup from '../../../features/app/learning/StartSessionPopup';
import LearningSessions from '../../../features/app/learning/LearningSessions';

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

const FixedSideContent: FC = () => (
  <div className='fixed top-6 right-6'>
    <UserProfileCard />
    <LearningOverview />
    <LearningTimeHeatmap />
  </div>
);

const FixedImageButtons: FC = () => (
  <div className='fixed top-6 left-6 flex items-center'>
    <ImageButton src='images/components/team.png' alt='学習チーム' label='学習チーム' size="lg" textSize="md" shape="square" />
    <ImageButton src='images/components/member.png' alt='学習中メンバー' label='学習中メンバー' size="lg" textSize="md" shape="square" />
    <ImageButton src='images/components/partner.png' alt='学習パートナー' label='学習パートナー' size="lg" textSize="md" shape="square" />
  </div>
);

const FixedInfo: FC = () => {
  return (
    <div className='fixed top-40 left-6'>
      <LearningSessions />
    </div>
  )
}

const HomeView: FC<HomeViewProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <StartLearningButton onClick={() => setOpen(true)} />
      <FixedSideContent />
      <FixedImageButtons />
      <FixedInfo />
      <StartSessionPopup open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default HomeView;
