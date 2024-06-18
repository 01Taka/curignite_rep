import React from 'react'
import { AnswerPost } from '../../../../../types/app/appTypes'
import AnswerContainer from './answerContainer/AnswerContainer'

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
          <AnswerContainer answer={post.answer} studentInfo={post.studentInfo}/>
        </div>
      ))}
    </div>
  )
}

export default AnswerListView