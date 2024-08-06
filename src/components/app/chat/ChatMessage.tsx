import React, { FC } from 'react';
import { Box } from '@mui/material';
import { cn } from '../../../functions/utils';

interface ChatMessageProps {
    content: string;
    isMyChat: boolean;
    className?: string;
}

const ChatMessage: FC<ChatMessageProps> = ({ content, isMyChat, className }) => (
    <Box
        component="div"
        className={cn(
            'p-4 bg-secondaryBase max-w-lg min-w-64 rounded-md shadow-sm',
            isMyChat ? "mr-4" : "",
            className
        )}
        sx={{
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
        }}
    >
        {content}
    </Box>
);

export default ChatMessage;
