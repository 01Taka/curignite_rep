import React, { FC, useState } from 'react';
import { Divider, IconButton, InputBase, Paper, Popover, Button, Box } from '@mui/material';
import AddLinkIcon from '@mui/icons-material/AddLink';
import SendIcon from '@mui/icons-material/Send';
import { ChatFormData } from '../../../types/firebase/db/chat/chatsTypes';

interface ChatInputProps {
  chat: ChatFormData;
  placeholder: string;
  onChangeChatContent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendChat: () => void;
  onAttachFile: (files: FileList) => void;
}

const ChatInput: FC<ChatInputProps> = ({ chat, placeholder, onChangeChatContent, onSendChat, onAttachFile }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onAttachFile(event.target.files);
      handleClose();
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
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
          value={chat.content}
          onChange={onChangeChatContent}
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
        <AttachmentsSelector 
          handleFileChange={handleFileChange}
          handleClose={handleClose}
        />
      </Popover>
    </>
  );
};

interface AttachmentsSelectorProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
}

const AttachmentsSelector: FC<AttachmentsSelectorProps> = ({ handleFileChange, handleClose }) => {
  return (
    <Box p={2}>
    <div>
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        multiple
        style={{ display: "none" }}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          アップロードするファイルを選択
        </Button>
      </label>
    </div>
      <Box mt={1}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </Box>
    </Box>
  )
}

export default ChatInput;
