import React, { useEffect, useState } from 'react'
import QuestionDisplayView from './QuestionDisplayView'
import { getIconUrl } from '../../../../../firebase/storage/get';
import { format } from 'date-fns';
import { Question } from '../../../../../types/firebase/db/qAndA/questionTypes';
import { UserOrganizationInfo } from '../../../../../types/firebase/db/usersTypes';

interface QuestionProps {
  question: Question;
  userOrganizationInfo: UserOrganizationInfo;
}

const QuestionDisplay: React.FC<QuestionProps> = ({
  question,
  userOrganizationInfo,
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
    username={userOrganizationInfo.username}
    grade={userOrganizationInfo.grade === 0 ? "" : userOrganizationInfo.grade.toString()}
    title={question.title}
    content={question.content}
    postDateStr={format(date, 'MM/dd, HH:mm  (yyyy)')}
  />
}

export default QuestionDisplay