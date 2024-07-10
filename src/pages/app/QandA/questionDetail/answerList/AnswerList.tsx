import React, { useEffect, useState } from 'react'
import AnswerListView from '../../../QandA/questionDetail/answerList/AnswerListView'
import { AnswerPost } from '../../../../../types/app/appTypes';
import { Answer } from '../../../../../firebase/db/app/QandA//answers/answers';
import { getStudentInfoWithUidDict } from '../../../../../firebase/db/auth/users/getUser';
import { where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { answersDB } from '../../../../../firebase/db/dbs';

const AnswerList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<AnswerPost[]>([]);

  useEffect(() => {
      const fetchAnswersAndStudentInfo = async () => {
        try {
            const fetchedAnswers = await answersDB.getAll(where("questionId", "==", id));
            await getStudentInfoFromAnswer(fetchedAnswers);
        } catch (error) {
            console.error("Error fetching answers or student info: ", error);
        }
    };

    if (id) {
        fetchAnswersAndStudentInfo();
    }
  }, [id]);

  const getStudentInfoFromAnswer = async (answers: Answer[]) => {
      const uidList: string[] = answers.map(answer => answer.authorUid);
      const info = await getStudentInfoWithUidDict(uidList);
      
      const posts = answers.map((answer) => ({
          studentInfo: info[answer.authorUid] || null,
          answer,
      }));
  
      setPosts(posts);
  };
  
  return <AnswerListView 
    answers={posts}
  />
}

export default AnswerList