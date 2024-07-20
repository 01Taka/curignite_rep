import React, { useEffect, useState } from 'react';
import QuestionDetailView from '../../QandA/questionDetail/QuestionDetailView';
import { useParams } from 'react-router-dom';
import { Question } from '../../../../firebase/db/app/QandA/questions/questions';
import { questionsDB, usersDB } from '../../../../firebase/db/dbs';
import { UserOrganizationInfo } from '../../../../firebase/db/app/user/usersTypes';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [userOrganizationInfo, setUserOrganizationInfo] = useState<UserOrganizationInfo | null>(null);
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
        const UserOrganizationInfo = await usersDB.readOrganizationByUid(uid);
        setUserOrganizationInfo(UserOrganizationInfo);
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
      userOrganizationInfo={userOrganizationInfo}
    />
  );
};

export default QuestionDetail;
