import React from 'react'
import QuestionContainer from './questionContainer/QuestionContainer';
import { Question } from '../../../../../firebase/db/app/QandA/questions/questions';
import { UserOrganizationInfo } from '../../../../../firebase/db/app/user/usersTypes';

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
