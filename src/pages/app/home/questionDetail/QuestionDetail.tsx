import React from 'react'
import QuestionDetailView from './QuestionDetailView'
import { useLocation } from 'react-router-dom'

const QuestionDetail: React.FC = () => {
    const location = useLocation();
    const id = location.pathname.match(/id=([^&]+)/)?.[1];    
    
  return <QuestionDetailView 
  
  />
}

export default QuestionDetail