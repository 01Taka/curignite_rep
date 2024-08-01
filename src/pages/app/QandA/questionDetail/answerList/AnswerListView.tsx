import React from 'react'
import AnswerContainer from './answerContainer/AnswerContainer'
import { Answer } from '../../../../../types/firebase/db/qAndA/answerTypes';
import { UserOrganizationData } from '../../../../../types/firebase/db/user/usersTypes';

export interface AnswerPost {
  userOrganizationData: UserOrganizationData | null;
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
          <AnswerContainer answer={post.answer} userOrganizationData={post.userOrganizationData}/>
        </div>
      ))}
    </div>
  )
}

export default AnswerListView