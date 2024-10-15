import React from 'react';
import ChooseSettingPopups from '../../../features/app/learning/popups/ChooseSettingPopups';

interface LearningRootProps { }

const LearningRoot: React.FC<LearningRootProps> = () => {
  return (
    <div>
      <ChooseSettingPopups />
    </div>
  );
};

export default LearningRoot;