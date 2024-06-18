import React, { useEffect, useState } from 'react'
import CreateQuestionView from './CreateQuestionView'
import { useAppSelector } from '../../../../redux/hooks';
import QuestionDB from '../../../../firebase/db/app/questions/question';

const CreateQuestion: React.FC = () => {
  const studentData = useAppSelector((state) => state.studentDataSlice);

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
      const question = new QuestionDB(title, content, studentData.uid);
      question.addToFirestore();
      setMessage('質問を追加しました。');
      resetForm();
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