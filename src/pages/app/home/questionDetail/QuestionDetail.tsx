import React, { useEffect, useState } from 'react';
import QuestionDetailView from './QuestionDetailView';
import { useParams } from 'react-router-dom';
import { QuestionDB } from '../../../../firebase/db/app/questions/question';
import { StudentInfoDB } from '../../../../firebase/db/auth/studentInfo/studentInfo';
import { getStudentInfo } from '../../../../firebase/db/auth/users/getUser';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<QuestionDB | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfoDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuestionDetails(id);
    } else {
      setError("Invalid question ID.");
      setLoading(false);
    }
  }, [id]);

  const fetchQuestionDetails = async (questionId: string) => {
    try {
      const question = await QuestionDB.getFromFirestore(questionId);
      if (question) {
        const uid = question.authorUid;
        const studentInfo = await getStudentInfo(uid);
        setStudentInfo(studentInfo);
        setQuestion(question);
      } else {
        setError("Question not found.");
      }
    } catch (err) {
      setError("Failed to fetch question details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuestionDetailView
      loading={loading}
      error={error}
      question={question}
      studentInfo={studentInfo}
    />
  );
};

export default QuestionDetail;
