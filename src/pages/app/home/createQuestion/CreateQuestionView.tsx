import { Alert, Button, TextField } from '@mui/material'
import React from 'react'
import Heading from '../../../../components/container/Heading'

interface CreateQuestionViewProps {
  title: string;
  content: string;
  submitDisabled: boolean;
  message: string,
  error: string,
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateQuestion: () => void;
}

const CreateQuestionView: React.FC<CreateQuestionViewProps> = ({
  title,
  content,
  submitDisabled,
  message,
  error,
  onTitleChange,
  onContentChange,
  onCreateQuestion,
}) => {
  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    onCreateQuestion();
  }

  return (
    <div className='flex flex-col max-w-full mt-16'>
      <Heading children='質問投稿' level={2}/>
      <form onSubmit={handleSubmit}>
        <div className='mt-8 w-full'>
        <TextField 
          required
          id="outlined-required"
          label="タイトル"
          fullWidth
          value={title}
          onChange={onTitleChange}
        />
        </div>
        <div className=' w-full mt-8'>
        <TextField
            required
            id="outlined-multiline-static"
            label="内容"
            multiline
            rows={16}
            fullWidth
            value={content}
            onChange={onContentChange}
        />
        </div>
        <div className='flex justify-end w-full mt-8'>
          {message && <Alert severity='info'>{message}</Alert>}
          {error && <Alert severity='error'>{error}</Alert>}
          <div className='w-64'>
            <Button variant='contained' type='submit' size='large' disabled={submitDisabled} fullWidth>
              決定
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateQuestionView