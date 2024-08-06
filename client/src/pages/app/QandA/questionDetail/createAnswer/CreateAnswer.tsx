import React, { useEffect, useState } from 'react'
import CreateAnswerView from './CreateAnswerView'
import { useAppSelector } from '../../../../../redux/hooks';
import { useParams } from 'react-router-dom';

const CreateAnswer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userData = useAppSelector((state) => state.userSlice);

  const [content, setContent] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (content) {
      setMessage('');
    }
    setSubmitDisabled(!content);
  }, [content])

  const onCreateAnswer = async () => {
    const uid = userData.uid;
    if (id && uid) {
      try {
        //await answersDB.createAnswers(id, content, uid);
        setMessage('回答を送信しました。');
        resetForm();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    }
  }

  const resetForm = () => {
    setContent('');
  }

  return <CreateAnswerView 
    content={content}
    submitDisabled={submitDisabled}
    error={error}
    message={message}
    onContentChange={(e) => setContent(e.target.value)}
    onSubmit={onCreateAnswer}
  />
}

export default CreateAnswer