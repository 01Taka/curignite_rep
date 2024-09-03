import React, { useEffect, useState } from 'react'
import AnswerListView, { AnswerPost } from '../../../QandA/questionDetail/answerList/AnswerListView'
import { where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { answersDB } from '../../../../../firebase/db/dbs';
import { Answer } from '../../../../../types/firebase/db/qAndA/answerTypes';

const AnswerList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  const [answerPosts, setAnswerPosts] = useState<AnswerPost[]>([]);

  useEffect(() => {
      const fetchAnswersAndUserOrganizationData = async () => {
        try {
            const fetchedAnswers = await answersDB.getAll(where("questionId", "==", id));
            const answerPosts = await getUserOrganizationDataWithAnswer(fetchedAnswers);
            setAnswerPosts(answerPosts);
        } catch (error) {
            console.error("Error fetching answers or student Data: ", error);
        }
    };

    if (id) {
        fetchAnswersAndUserOrganizationData();
    }
  }, [id]);

    const getUserOrganizationDataWithAnswer = async (answers: Answer[]): Promise<AnswerPost[]> => {
        const answerPosts = await Promise.all(answers.map(async (answer) => { // await readUserOrganizationByUid(answer.authorUid);
            const res: AnswerPost = {
                userOrganizationData: null,
                answer,
            };
            return res;
        }));
        return answerPosts;
    };

  return <AnswerListView 
    answers={answerPosts}
  />
}

export default AnswerList