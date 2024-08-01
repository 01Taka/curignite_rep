import React from 'react';
import CreateAnswer from './createAnswer/CreateAnswer';
import AnswerList from './answerList/AnswerList';
import TopTab from '../../../../components/app/tab/TopTab';
import QuestionDisplay from './question/QuestionDisplay';
import { Question } from '../../../../types/firebase/db/qAndA/questionTypes';
import { initialUserOrganizationData, UserOrganizationData } from '../../../../types/firebase/db/user/userOrganizationType';

interface QuestionDetailViewProps {
  loading: boolean;
  error: string | null;
  question: Question | null;
  userOrganizationData: UserOrganizationData | null;
}

const QuestionDetailView: React.FC<QuestionDetailViewProps> = ({
  loading,
  error,
  question,
  userOrganizationData,
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
        <QuestionDisplay
          question={question}
          userOrganizationData={userOrganizationData ? userOrganizationData : initialUserOrganizationData}
        />
      </div>
    </div>
  );
}

export default QuestionDetailView;
