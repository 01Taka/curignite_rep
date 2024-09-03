import React, { FC, useState } from 'react';
import { Divider, IconButton, InputBase, Paper, Popover } from '@mui/material';
import AddLinkIcon from '@mui/icons-material/AddLink';
import SendIcon from '@mui/icons-material/Send';
import { FormStateChangeFunc } from '../../../types/util/componentsTypes';
import FileSelector from './FileSelector';

export interface ChatFormState {
  content: string;
  files: File[];
  replyTo?: string; // TODO: リプライ先を指定するフォームを作成
}

interface ChatInputProps {
  formState: ChatFormState;
  placeholder: string;
  onFormStateChange: FormStateChangeFunc;
  onSendChat: () => void;
}

const ChatInput: FC<ChatInputProps> = ({ formState, placeholder, onFormStateChange, onSendChat }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 800 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSendChat();
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={handleClickOpen}>
          <AddLinkIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ 'aria-label': placeholder }}
          value={formState.content}
          onChange={onFormStateChange}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={onSendChat}>
          <SendIcon />
        </IconButton>
      </Paper>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <FileSelector 
          onFileChange={onFormStateChange}
          handleClose={handleClose}
        />
      </Popover>
    </>
  );
};

export default ChatInput;