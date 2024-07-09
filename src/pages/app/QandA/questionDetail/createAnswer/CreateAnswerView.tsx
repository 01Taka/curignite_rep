import { Alert, Button, TextField } from '@mui/material'
import React from 'react'

interface CreateAnswerViewProps {
  content: string;
  submitDisabled: boolean;
  error: string;
  message: string;
  onContentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const CreateAnswerView: React.FC<CreateAnswerViewProps> = ({
  content,
  submitDisabled,
  error,
  message,
  onContentChange,
  onSubmit,
}) => {
  
  return (
    <div>
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
        <Button children='回答する' variant='contained' disabled={submitDisabled} onClick={onSubmit}/>
        {message && <Alert severity='info'>{message}</Alert>}
        {error && <Alert severity='error'>{error}</Alert>}
    </div>
  )
}

export default CreateAnswerView