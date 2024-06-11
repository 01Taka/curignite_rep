import React from 'react'
import { QuestionPost } from '../../../../types/app/appTypes';
import QuestionContainer from './questionContainer/QuestionContainer';

interface QuestionListViewProps {
  questionPosts: QuestionPost[];
}

const QuestionListView: React.FC<QuestionListViewProps> = ({
  questionPosts
}) => {
  return (
    <div>
      {questionPosts.map((post, index) => (
        <div key={index}>
          <QuestionContainer title={post.question.title} content={post.question.content} postDate={post.question.createdAt}/>
        </div>
      ))}
    </div>
  )
}

export default QuestionListView;
