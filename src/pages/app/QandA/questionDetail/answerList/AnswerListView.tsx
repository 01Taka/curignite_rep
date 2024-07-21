import React from 'react'
import AnswerContainer from './answerContainer/AnswerContainer'
import { Answer } from '../../../../../types/firebase/db/qAndA/answerTypes';
import { UserOrganizationInfo } from '../../../../../types/firebase/db/usersTypes';

export interface AnswerPost {
  userOrganizationInfo: UserOrganizationInfo | null;
  answer: Answer;
}

interface AnswerListViewProps {
  answers: AnswerPost[]
}

const AnswerListView: React.FC<AnswerListViewProps> = ({
  answers,
}) => {
  return (
    <div>
      {answers.map((post, index) => (
        <div key={index}>
          <AnswerContainer answer={post.answer} userOrganizationInfo={post.userOrganizationInfo}/>
        </div>
      ))}
    </div>
  )
}

export default AnswerListView