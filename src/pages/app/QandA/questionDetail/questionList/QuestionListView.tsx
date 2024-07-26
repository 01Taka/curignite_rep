import React from 'react'
import QuestionContainer from './questionContainer/QuestionContainer';
import { UserOrganizationData } from '../../../../../types/firebase/db/usersTypes';
import { Question } from '../../../../../types/firebase/db/qAndA/questionTypes';

export interface QuestionPost {
  userOrganizationData: UserOrganizationData | null;
  question: Question;
}

interface QuestionListViewProps {
  questionPosts: QuestionPost[];
}

const QuestionListView: React.FC<QuestionListViewProps> = ({
  questionPosts,
}) => {
  return (
    <div>
      {questionPosts.map((post, index) => (
        <div key={index}>
          <QuestionContainer question={post.question} userOrganizationData={post.userOrganizationData}/>
        </div>
      ))}
    </div>
  )
}

export default QuestionListView;
