import React, { useEffect, useState } from 'react';
import QuestionListView from './QuestionListView';
import QuestionDB from '../../../../firebase/db/app/questions/question';
import { getStudentInfoWithUidDict } from '../../../../firebase/db/auth/users/getUser';
import { QuestionPost } from '../../../../types/app/appTypes';

const QuestionList: React.FC = () => {
    const [studentInfoList, setStudentInfoList] = useState<QuestionPost[]>([]);

    useEffect(() => {
        const fetchQuestionsAndStudentInfo = async () => {
            try {
                const fetchedQuestions = await QuestionDB.getAll();
                await getStudentInfoFromQuestion(fetchedQuestions);
            } catch (error) {
                console.error("Error fetching questions or student info: ", error);
            }
        };

        fetchQuestionsAndStudentInfo();
    }, []);

    const getStudentInfoFromQuestion = async (questions: QuestionDB[]) => {
        const uidList: string[] = questions.map(question => question.authorUid);
        const info = await getStudentInfoWithUidDict(uidList);
        
        const studentInfoList = questions.map((question) => ({
            studentInfo: info[question.authorUid] || null,
            question,
        }));
    
        setStudentInfoList(studentInfoList);
    };
    
    return <QuestionListView 
        questionPosts={studentInfoList}
    />;
}

export default QuestionList;
