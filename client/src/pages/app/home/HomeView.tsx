import React, { FC, useState } from 'react';
import LearningOverview from '../../../features/app/learningInfo/LearningOverview';
import LearningTimeHeatmap from '../../../features/app/learningInfo/LearningTimeHeatmap';
import ImageButton from '../../../components/input/button/ImageButton';
import UserProfileCard from '../../../features/app/user/UserProfileCard';
import { useNavigate } from 'react-router-dom';
import { mainPaths } from '../../../types/path/mainPaths';
import { useAppSelector } from '../../../redux/hooks';
import { revertTimestampConversion } from '../../../functions/db/dataFormatUtils';
import Helps from '../../../features/app/help/Helps';
import StartLearningButton from '../../../features/app/learningInfo/StartLearningButton';
import TaskPageLink from '../../../features/app/task/tasks/TaskPageLink';
import Popup from '../../../components/display/popup/Popup';
import CreateLearningGoalForm from '../../../features/app/learningGoal/CreateLearningGoalForm';
import LearningGoalCard from '../../../features/app/learningGoal/learningGoalWork/LearningGoalWorkDisplay';

interface HomeViewProps {}

const FixedSideContent: FC = () => {
  const userData = useAppSelector(state => state.userSlice.userData);
  
  return (
    <div className='fixed top-6 right-6 max-w-sm'>
    <UserProfileCard userData={userData ? revertTimestampConversion(userData) : null} shadow />
    <LearningOverview />
    <LearningTimeHeatmap />
    <TaskPageLink />
  </div>
  )
}

const FixedNavigateButtons: FC = () => {
  return (
    <div className='fixed top-6 left-6 flex items-center'>
      <NavigateButton src='images/components/team.png' label='学習チーム' navigatePath={mainPaths.team} />
      <NavigateButton src='images/components/member.png' label='学習中メンバー' navigatePath={mainPaths.activeMember} />
      {/* <NavigateButton src='images/components/partner.png' label='学習パートナー' navigatePath={mainPaths.partner} /> 未実装のためコメントアウト */}
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
      {/* <LearningSessions />
      <Goals /> */}
      <Helps />
    </div>
  )
}

const StartLearning: FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <StartLearningButton onClickAtNotLearning={() => setOpen(true)} onClickAtLearning={() => navigate(mainPaths.focusLearning)}/>
      <Popup open={open} handleClose={() => setOpen(false)} >
        <CreateLearningGoalForm onCreated={() => setOpen(false)} />
      </Popup>
    </>
  )
}

const HomeView: FC<HomeViewProps> = () => {

  return (
    <div>

      <FixedSideContent />
      <FixedNavigateButtons />
      <FixedInfo />
      <StartLearning />
      {/* <StartSessionPopup open={open} handleClose={() => setOpen(false)} /> */}
      <div className='fixed flex w-full justify-center top-16'>
        <div className='w-96 h-64 bg-slate-200 p-2 rounded'>
          <LearningGoalCard />
        </div>
      </div>

    </div>
  );
};

export default HomeView;
