import React, { useEffect, useState } from 'react'
import CreateQuestionView from './CreateQuestionView'
import { useAppSelector } from '../../../../redux/hooks';
import { questionsDB } from '../../../../firebase/db/dbs';

const CreateQuestion: React.FC = () => {
  const userData = useAppSelector((state) => state.userDataSlice);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (title || content) {
      setMessage('');
    }
    setSubmitDisabled(!(title && content))
  }, [title, content])

  const onCreateQuestion = () => {
    try {
      const uid = userData.uid;
      if (uid) {
        questionsDB.createQuestions(title, content, uid);
        setMessage('質問を追加しました。');
        resetForm();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  const resetForm = () => {
    setTitle('');
    setContent('');
  }

  return <CreateQuestionView 
    title={title}
    content={content}
    submitDisabled={submitDisabled}
    message={message}
    error={error}
    onTitleChange={(e) => setTitle(e.target.value)}
    onContentChange={(e) => setContent(e.target.value)}
    onCreateQuestion={onCreateQuestion}
  />
}

export default CreateQuestion