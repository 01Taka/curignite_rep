import React from 'react';
import { Box, Button, Snackbar } from '@mui/material';
import { RangeSelectionState } from '../../../../hooks/range/rangeHookTypes';

interface SnackbarForRangeSelectionProps {
  categoryName: string;
  state: RangeSelectionState;
  onCancelSelection: () => void;
  onDeleteOperatingRange: () => void;
  onSelectAll?: () => void;
}

const SnackbarForRangeSelection: React.FC<SnackbarForRangeSelectionProps> = ({ categoryName, state, onCancelSelection, onDeleteOperatingRange, onSelectAll }) => {
  const message = state === 'selecting' ? `「${categoryName}」の範囲を追加` : `「${categoryName}」の範囲を編集`;
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={state !== 'idle'}
      autoHideDuration={6000}
      message={message}
      action={
        <Box>
          {state === 'edit' &&
            <Button sx={{ color: 'skyblue' }} onClick={onDeleteOperatingRange} >
              削除
            </Button>
          }
          {
            state === 'selecting' && onSelectAll &&
            <Button sx={{ color: 'skyblue' }} onClick={onSelectAll} >
              すべて選択
            </Button>
          }
          <Button sx={{ color: 'skyblue' }} onClick={onCancelSelection} >
            キャンセル
          </Button>
        </Box>
      }
    />
  );
};

export default SnackbarForRangeSelection;