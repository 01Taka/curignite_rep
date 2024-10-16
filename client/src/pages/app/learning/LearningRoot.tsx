import React from 'react';
import ChooseSettingPopups from '../../../features/app/learning/popups/ChooseSettingPopups';
import GradientIcon from '../../../components/display/container/GradientIcon';

interface LearningRootProps { }

const LearningRoot: React.FC<LearningRootProps> = () => {
  return (
    <div>
      <GradientIcon colors={{10: '#fff'}} errorColor='#afa' value={20} title='titleeee'>
        HE
      </GradientIcon>
      <ChooseSettingPopups />
    </div>
  );
};

export default LearningRoot;