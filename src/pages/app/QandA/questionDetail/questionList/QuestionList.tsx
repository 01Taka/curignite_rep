import React, { useEffect, useState } from 'react';
import QuestionListView from '../../../QandA/questionDetail/questionList/QuestionListView';
import { getStudentInfoWithUidDict } from '../../../../../firebase/db/auth/users/getUser';
import { QuestionPost } from '../../../../../types/app/appTypes';
import { questionsDB } from '../../../../../firebase/db/dbs';
import { Questions } from '../../../../../firebase/db/app/QandA/questions/questions';

const QuestionList: React.FC = () => {
    const [studentInfoList, setStudentInfoList] = useState<QuestionPost[]>([]);

    useEffect(() => {
        const fetchQuestionsAndStudentInfo = async () => {
            try {
                const fetchedQuestions = await questionsDB.getAll();
                await getStudentInfoFromQuestion(fetchedQuestions);
            } catch (error) {
                console.error("Error fetching questions or student info: ", error);
            }
        };

        fetchQuestionsAndStudentInfo();
    }, []);

    const getStudentInfoFromQuestion = async (questions: Questions[]) => {
        const uidList: string[] = questions.map(question => question.authorUid);
        const info = await getStudentInfoWithUidDict(uidList);
        
        const studentInfoList = questions.map((question) => ({
            studentInfo: info[question.authorUid] || null,
            question,
        }));
    
        // setStudentInfoList(studentInfoList);
    };
    
    return <QuestionListView 
        questionPosts={studentInfoList}
    />;
}

export default QuestionList;
