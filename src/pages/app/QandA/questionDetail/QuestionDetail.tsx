import React, { useEffect, useState } from 'react';
import QuestionDetailView from '../../QandA/questionDetail/QuestionDetailView';
import { useParams } from 'react-router-dom';
import { Question } from '../../../../firebase/db/app/QandA/questions/questions';
import { questionsDB, usersDB } from '../../../../firebase/db/dbs';
import { OrganizationExtendsUser } from '../../../../firebase/db/app/user/users';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [organizationExtendsUser, setOrganizationExtendsUser] = useState<OrganizationExtendsUser | null>(null);
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
        const organizationExtendsUser = await usersDB.readOrganizationByUid(uid);
        setOrganizationExtendsUser(organizationExtendsUser);
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
      organizationExtendsUser={organizationExtendsUser}
    />
  );
};

export default QuestionDetail;
