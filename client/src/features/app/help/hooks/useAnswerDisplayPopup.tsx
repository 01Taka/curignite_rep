import React, { useState } from 'react';
import { HelpAndAnswersWithFileUrls } from '../../../../types/firebase/db/user/userStructure';
import Popup from '../../../../components/util/Popup';
import AnswersView from '../AnswersView';

const useAnswerDisplayPopup = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<HelpAndAnswersWithFileUrls | null>(null);

  const handleSelectAnswers = (answers: HelpAndAnswersWithFileUrls | null) => {
    setSelectedAnswers(answers);
  };

  const AnswerPopup = selectedAnswers ? (
    <Popup open handleClose={() => setSelectedAnswers(null)}>
      <AnswersView answers={selectedAnswers.answers} />
    </Popup>
  ) : null;

  return { handleSelectAnswers, AnswerPopup };
}

export default useAnswerDisplayPopup;
