import React from 'react'
import AnswerContainerView from './AnswerContainerView'
import { format } from 'date-fns';
import { UserOrganizationData } from '../../../../../../types/firebase/db/usersTypes';
import { Answer } from '../../../../../../types/firebase/db/qAndA/answerTypes';

interface AnswerContainerProps {
    answer: Answer;
    userOrganizationData: UserOrganizationData | null;
}

const AnswerContainer: React.FC<AnswerContainerProps> = ({ answer, userOrganizationData }) => {
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