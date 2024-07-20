import React from 'react';
import { Question } from '../../../../firebase/db/app/QandA/questions/questions';
import CreateAnswer from './createAnswer/CreateAnswer';
import AnswerList from './answerList/AnswerList';
import TopTab from '../../../../components/app/tab/TopTab';
import QuestionDisplay from './question/QuestionDisplay';
import { initialUserOrganizationInfoState, UserOrganizationInfo } from '../../../../firebase/db/app/user/usersTypes';

interface QuestionDetailViewProps {
  loading: boolean;
  error: string | null;
  question: Question | null;
  userOrganizationInfo: UserOrganizationInfo | null;
}

const QuestionDetailView: React.FC<QuestionDetailViewProps> = ({
  loading,
  error,
  question,
  userOrganizationInfo,
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
          userOrganizationInfo={userOrganizationInfo ? userOrganizationInfo : initialUserOrganizationInfoState}
        />
      </div>
    </div>
  );
}

export default QuestionDetailView;
