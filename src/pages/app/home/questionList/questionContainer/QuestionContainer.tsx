import React, { useState } from 'react'
import QuestionContainerView from './QuestionContainerView'
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

interface QuestionContainerProps {
    title: string;
    content?: string;
    postDate: Timestamp;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({
    title,
    content = "",
    postDate,
}) => {
    const [expanded, setExpanded] = useState(false);
    const maxChars = 250; // 表示する最大文字数
    const date = postDate.toDate();
  
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const truncatedContent = content.length > maxChars && !expanded 
      ? `${content.substring(0, maxChars)}...` 
      : content;
      
  return <QuestionContainerView 
    title={title}
    content={truncatedContent}
    postDateStr={format(date, 'yyyy-MM-dd HH:mm')}
    overflow={content.length > maxChars}
    expanded={expanded}
    handleExpandClick={handleExpandClick}
  />
}

export default QuestionContainer