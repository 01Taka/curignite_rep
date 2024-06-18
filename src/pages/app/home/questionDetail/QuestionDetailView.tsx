import React from 'react';
import QuestionDB from '../../../../firebase/db/app/questions/question';
import { StudentInfoDB } from '../../../../firebase/db/auth/studentInfo/studentInfo';
import Question from './question/Question';
import CreateAnswer from './createAnswer/CreateAnswer';
import AnswerList from './answerList/AnswerList';
import TopTab from '../../../../components/app/tab/TopTab';

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
    <div className='flex'>
      <div className='w-1/2'>
        <TopTab
          titles={[
            "回答する",
            "回答一覧"
          ]}
          childrenList={[
            <CreateAnswer />,
            <AnswerList />
          ]}
        />
      </div>
      <div className='w-1/2'>
        <Question 
          question={question}
          studentInfo={studentInfo ? studentInfo : StudentInfoDB.getEmptyStudentInfo()}
        />
      </div>
    </div>
  );
}

export default QuestionDetailView;
