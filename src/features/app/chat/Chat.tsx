import React, { FC } from 'react';
import { ChatData } from '../../../types/firebase/db/chat/chatsTypes';

interface ChatProps {
    chat: ChatData;
}

const Chat: FC<ChatProps> = ({ chat }) => {
    return (
        <div key={chat.docId}>
            <p>{chat.content}</p>
            <span>{chat.createdAt.toDate().toString()}</span>
        </div>
    );
};

export default Chat;
