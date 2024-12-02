import React from 'react';
import useDeleteProblemSet from '../../shared/hooks/problemSet/crud/useDeleteProblemSet';
import { ProblemSetRead } from '../../../../../types/firebase/db/task/taskStructure';
import { Box, Button, Typography } from '@mui/material';

interface DeleteProblemSetFormProps {
  problemSet: ProblemSetRead;
  onDeleted: () => void;
  onCancelDelete: () => void;
}

const DeleteProblemSetForm: React.FC<DeleteProblemSetFormProps> = ({ problemSet, onDeleted, onCancelDelete }) => {
  const { asyncStatus, errorMessage, handleDeleteActivity } = useDeleteProblemSet(problemSet.docId);

  const handleDelete = () => {
    onDeleted();
    handleDeleteActivity();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
        maxWidth: 400,
        margin: 'auto',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {problemSet.name} を削除しますか？
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        現在進行中の課題も削除されます。<br />
        削除後は元に戻すことはできません。
      </Typography>
      
      {/* Error message display */}
      {errorMessage && (
        <Typography variant="body2" sx={{ color: 'error.main', mt: 2 }}>
          {errorMessage}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          onClick={onCancelDelete}
          variant="outlined"
          color="primary"
          sx={{ width: '45%' }}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          sx={{ width: '45%' }}
          disabled={asyncStatus === 'loading'}
        >
          削除
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteProblemSetForm;
