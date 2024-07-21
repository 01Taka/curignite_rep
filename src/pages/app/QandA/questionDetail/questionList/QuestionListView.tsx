import React from 'react'
import QuestionContainer from './questionContainer/QuestionContainer';
import { UserOrganizationInfo } from '../../../../../types/firebase/db/usersTypes';
import { Question } from '../../../../../types/firebase/db/qAndA/questionTypes';

export interface QuestionPost {
  userOrganizationInfo: UserOrganizationInfo | null;
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
          <QuestionContainer question={post.question} userOrganizationInfo={post.userOrganizationInfo}/>
        </div>
      ))}
    </div>
  )
}

export default QuestionListView;
