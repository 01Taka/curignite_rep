import React, { useEffect, useState } from 'react'
import QuestionDisplayView from './QuestionDisplayView'
import { Question } from '../../../../../firebase/db/app/QandA/questions/questions';
import { getIconUrl } from '../../../../../firebase/storage/get';
import { format } from 'date-fns';
import { OrganizationExtendsUser } from '../../../../../firebase/db/app/user/users';

interface QuestionProps {
  question: Question;
  organizationExtendsUser: OrganizationExtendsUser;
}

const QuestionDisplay: React.FC<QuestionProps> = ({
  question,
  organizationExtendsUser,
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
    username={organizationExtendsUser.username}
    grade={organizationExtendsUser.grade === 0 ? "" : organizationExtendsUser.grade.toString()}
    title={question.title}
    content={question.content}
    postDateStr={format(date, 'MM/dd, HH:mm  (yyyy)')}
  />
}

export default QuestionDisplay