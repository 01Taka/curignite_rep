import React, { useEffect, useState } from 'react'
import QuestionView from './QuestionView'
import { Questions } from '../../../../../firebase/db/app/QandA/questions/questions';
import { StudentInfoDB } from '../../../../../firebase/db/auth/studentInfo/studentInfo';
import { getIconUrl } from '../../../../../firebase/storage/get';
import { format } from 'date-fns';

interface QuestionProps {
  question: Questions;
  studentInfo: StudentInfoDB;
}

const Question: React.FC<QuestionProps> = ({
  question,
  studentInfo,
}) => {
  const [iconUrl, setIconUrl] = useState('');
  const date = question.createdAt.toDate();

  useEffect(() => {
    const setIcon = async () => {
      const iconUrl = await getIconUrl(question.authorUid);
      setIconUrl(iconUrl);
    }
    setIcon();
  }, [question])

  return <QuestionView 
    iconUrl={iconUrl}
    username={studentInfo.username}
    grade={studentInfo.grade === 0 ? "" : studentInfo.grade.toString()}
    title={question.title}
    content={question.content}
    postDateStr={format(date, 'MM/dd, HH:mm  (yyyy)')}
  />
}

export default Question