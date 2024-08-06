import React, { useEffect, useState } from 'react';
import QuestionListView, { QuestionPost } from '../../../QandA/questionDetail/questionList/QuestionListView';
import { questionsDB } from '../../../../../firebase/db/dbs';
import { Question } from '../../../../../types/firebase/db/qAndA/questionTypes';
import { initialUserOrganizationData, UserOrganizationData } from '../../../../../types/firebase/db/user/userOrganizationType';

const QuestionList: React.FC = () => {
    const [questionPosts, setQuestionPosts] = useState<QuestionPost[]>([]);

    useEffect(() => {
        const fetchQuestionPosts = async () => {
            try {
                const fetchedQuestions = await questionsDB.getAll();
                const questionPosts = await getUserOrganizationDataWithQuestion(fetchedQuestions);
                setQuestionPosts(questionPosts);
            } catch (error) {
                console.error("Error fetching questions or student Data: ", error);
            }
        };

        fetchQuestionPosts();
    }, []);

    const getUserOrganizationDataWithQuestion = async (questions: Question[]): Promise<QuestionPost[]> => {
        const questionPosts = await Promise.all(questions.map(async (question) => {
            const userOrganizationData: UserOrganizationData = initialUserOrganizationData; //await readUserOrganizationByUid(question.authorUid);
            const res: QuestionPost = {
                userOrganizationData,
                question,
            };
            return res;
        }));
        return questionPosts;
    };
    
    return <QuestionListView 
        questionPosts={questionPosts}
    />;
}

export default QuestionList;
