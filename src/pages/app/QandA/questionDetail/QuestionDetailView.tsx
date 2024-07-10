import React from 'react';
import { Question } from '../../../../firebase/db/app/QandA/questions/questions';
import CreateAnswer from './createAnswer/CreateAnswer';
import AnswerList from './answerList/AnswerList';
import TopTab from '../../../../components/app/tab/TopTab';
import { initialOrganizationExtendsUserState, OrganizationExtendsUser } from '../../../../firebase/db/app/user/users';
import QuestionDisplay from './question/QuestionDisplay';

interface QuestionDetailViewProps {
  loading: boolean;
  error: string | null;
  question: Question | null;
  organizationExtendsUser: OrganizationExtendsUser | null;
}

const QuestionDetailView: React.FC<QuestionDetailViewProps> = ({
  loading,
  error,
  question,
  organizationExtendsUser,
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
          organizationExtendsUser={organizationExtendsUser ? organizationExtendsUser : initialOrganizationExtendsUserState}
        />
      </div>
    </div>
  );
}

export default QuestionDetailView;
