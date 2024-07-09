import React, { useState } from 'react'
import QuestionContainerView from './QuestionContainerView'
import { format } from 'date-fns';
import { StudentInfoDB } from '../../../../../../firebase/db/auth/studentInfo/studentInfo';
import { useNavigate } from 'react-router-dom';
import { Questions } from '../../../../../../firebase/db/app/QandA/questions/questions';

interface QuestionContainerProps {
    question: Questions;
    studentInfo: StudentInfoDB | null;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({
    question,
    studentInfo,
}) => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const maxChars = 250; // 表示する最大文字数
    const date = question.createdAt.toDate();
    const content = question.content;

    if (!content) {
      return null;
    }

    const truncatedContent = content.length > maxChars && !expanded 
      ? `${content.substring(0, maxChars)}...` 
      : content;

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleOpenQuestionDetail = () => {
      navigate(`/home/question/${question.documentId}`)
    }
  
  return <QuestionContainerView 
    title={question.title}
    content={truncatedContent}
    postDateStr={format(date, 'yyyy-MM-dd HH:mm')}
    overflow={content.length > maxChars}
    expanded={expanded}
    handleExpandClick={handleExpandClick}
    onQuestionClick={handleOpenQuestionDetail}
  />
}

export default QuestionContainer