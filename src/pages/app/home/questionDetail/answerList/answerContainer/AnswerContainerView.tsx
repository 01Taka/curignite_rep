import React from 'react'

interface AnswerContainerViewProps {
    content: string;
    postDateStr: string;
}

const AnswerContainerView: React.FC<AnswerContainerViewProps> = ({
    content,
    postDateStr,
}) => {
  return (
    <div>
        <p>{postDateStr}</p>
        <p>{content}</p>
    </div>
  )
}

export default AnswerContainerView