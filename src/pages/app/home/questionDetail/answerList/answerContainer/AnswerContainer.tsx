import React from 'react'
import AnswerContainerView from './AnswerContainerView'
import AnswerDB from '../../../../../../firebase/db/app/answers/answers'
import { StudentInfoDB } from '../../../../../../firebase/db/auth/studentInfo/studentInfo';
import { format } from 'date-fns';

interface AnswerContainerProps {
    answer: AnswerDB;
    studentInfo: StudentInfoDB | null;
}

const AnswerContainer: React.FC<AnswerContainerProps> = ({ answer, studentInfo }) => {
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