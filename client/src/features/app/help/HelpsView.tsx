import React, { FC, ReactNode, useState } from 'react';
import { HelpAndAnswersWithFileUrls } from '../../../types/firebase/db/user/userStructure';
import HelpItem from './HelpCard';
import Popup from '../../../components/util/Popup';
import AnswersView from './AnswersView';

interface HelpsViewProps {
  helpWithAnswersList: HelpAndAnswersWithFileUrls[];
  children?: ReactNode;
  shadow?: boolean;
}

const HelpsView: FC<HelpsViewProps> = ({ helpWithAnswersList, children, shadow }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<HelpAndAnswersWithFileUrls | null>(null);

  const handleSelectAnswers = (data: HelpAndAnswersWithFileUrls) => {
    setSelectedAnswers(data);
  };

  return (
    <>
      <div className='flex flex-col space-y-4'>
        {helpWithAnswersList.map((data, index) => (
          <div key={index} className='flex'>
            <div className='w-full'>
              <HelpItem helpAndAnswersInfo={data} onSelectAnswers={handleSelectAnswers} shadow={shadow} />
            </div>
            <div className='my-auto'>
              {children}
            </div>
          </div>
        ))}
      </div>
      <Popup open={!!selectedAnswers} handleClose={() => setSelectedAnswers(null)}>
        {selectedAnswers && <AnswersView answers={selectedAnswers.answers} />}
      </Popup>
    </>
  );
};

export default HelpsView;
