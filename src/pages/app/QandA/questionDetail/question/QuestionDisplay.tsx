import React, { useEffect, useState } from 'react'
import QuestionDisplayView from './QuestionDisplayView'
import { getIconUrl } from '../../../../../firebase/storage/get';
import { format } from 'date-fns';
import { Question } from '../../../../../types/firebase/db/qAndA/questionTypes';
import { UserOrganizationData } from '../../../../../types/firebase/db/user/usersTypes';

interface QuestionProps {
  question: Question;
  userOrganizationData: UserOrganizationData;
}

const QuestionDisplay: React.FC<QuestionProps> = ({
  question,
  userOrganizationData,
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

  return <QuestionDisplayView 
    iconUrl={iconUrl}
    username={userOrganizationData.username}
    grade={userOrganizationData.grade === 0 ? "" : userOrganizationData.grade.toString()}
    title={question.title}
    content={question.content}
    postDateStr={format(date, 'MM/dd, HH:mm  (yyyy)')}
  />
}

export default QuestionDisplay