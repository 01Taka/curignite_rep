import React, { useEffect, useState } from 'react'
import AnswerListView from './AnswerListView'
import { AnswerPost } from '../../../../../types/app/appTypes';
import AnswerDB from '../../../../../firebase/db/app/answers/answers';
import { getStudentInfoWithUidDict } from '../../../../../firebase/db/auth/users/getUser';
import { QueryConstraint, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const AnswerList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<AnswerPost[]>([]);

  useEffect(() => {
      const fetchAnswersAndStudentInfo = async () => {
        const constraints: QueryConstraint[] = [
            where("questionId", "==", id)
        ];

        try {
            const fetchedAnswers = await AnswerDB.getAll(constraints);
            await getStudentInfoFromAnswer(fetchedAnswers);
        } catch (error) {
            console.error("Error fetching answers or student info: ", error);
        }
    };

    if (id) {
        fetchAnswersAndStudentInfo();
    }
  }, [id]);

  const getStudentInfoFromAnswer = async (answers: AnswerDB[]) => {
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