import React, { useEffect } from 'react';
import { QuestionDB } from '../../../../firebase/db/app/questions/question';
import { StudentInfoDB } from '../../../../firebase/db/auth/studentInfo/studentInfo';

interface QuestionDetailViewProps {
  loading: boolean;
  error: string | null;
  question: QuestionDB | null;
  studentInfo: StudentInfoDB | null;
}

const QuestionDetailView: React.FC<QuestionDetailViewProps> = ({
  loading,
  error,
  question,
  studentInfo,
}) => {
  useEffect(() => {
    if (question) {
      console.log(question, studentInfo);
    }
  }, [question, studentInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!question) {
    return <div>No question data available.</div>;
  }

  return (
    <div>
      <h1>{question.title}</h1>
      <p>{question.content}</p>
      {studentInfo && (
        <div>
          <h2>Author: {studentInfo.username}</h2>
          <p>Grade: {studentInfo.grade}</p>
        </div>
      )}
    </div>
  );
}

export default QuestionDetailView;
