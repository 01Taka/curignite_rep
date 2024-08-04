import React, { FC } from 'react';
import { ChatData } from '../../../types/firebase/db/chat/chatsTypes';
import { dateTimeToString } from '../../../functions/dateTimeUtils';

interface ChatProps {
    chat: ChatData;
}

const Chat: FC<ChatProps> = ({ chat }) => {
    return (
        <div key={chat.docId}>
            <p>{chat.content}</p>
            <span>{`${dateTimeToString(chat.createdAt, {}, false)}前`}</span>
        </div>
    );
};

export default Chat;
