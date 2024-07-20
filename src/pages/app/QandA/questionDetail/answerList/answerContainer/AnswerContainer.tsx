import React from 'react'
import AnswerContainerView from './AnswerContainerView'
import { Answer } from '../../../../../../firebase/db/app/QandA//answers/answers'
import { format } from 'date-fns';
import { UserOrganizationInfo } from '../../../../../../firebase/db/app/user/usersTypes';

interface AnswerContainerProps {
    answer: Answer;
    userOrganizationInfo: UserOrganizationInfo | null;
}

const AnswerContainer: React.FC<AnswerContainerProps> = ({ answer, userOrganizationInfo }) => {
    const date = answer.createdAt.toDate();
    const content = answer.content;

    if (!content) {
        return null;
    }
    
    return <AnswerContainerView 
        content={content}
        postDateStr={format(date, 'yyyy-MM-dd HH:mm')}
    />
}

export default AnswerContainer