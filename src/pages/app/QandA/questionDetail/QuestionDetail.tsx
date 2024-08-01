import React, { useEffect, useState } from 'react';
import QuestionDetailView from '../../QandA/questionDetail/QuestionDetailView';
import { useParams } from 'react-router-dom';
import { questionsDB, usersDB } from '../../../../firebase/db/dbs';
import { UserOrganizationData } from '../../../../types/firebase/db/user/usersTypes';
import { Question } from '../../../../types/firebase/db/qAndA/questionTypes';
import { readUserOrganizationByUid } from '../../../../firebase/db/app/user/subCollection/userOrganizationsDBUtil';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [userOrganizationData, setUserOrganizationData] = useState<UserOrganizationData | null>(null);
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
      const question = await questionsDB.read(questionId);
      if (question) {
        const uid = question.authorUid;
        const UserOrganizationData = await readUserOrganizationByUid(uid);
        setUserOrganizationData(UserOrganizationData);
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
      userOrganizationData={userOrganizationData}
    />
  );
};

export default QuestionDetail;
