import React from 'react'
import PosterInfo from './PosterInfo';

interface QuestionDisplayViewProps {
  iconUrl: string;
  username: string;
  grade: string;
  postDateStr: string;
  title: string;
  content: string;
}

const QuestionDisplayView: React.FC<QuestionDisplayViewProps> = ({
  iconUrl,
  username,
  grade,
  postDateStr,
  title,
  content,
}) => {
  return (
    <div>
      <PosterInfo iconUrl={iconUrl} username={username} grade={grade} postDateStr={postDateStr} />
      <div>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default QuestionDisplayView