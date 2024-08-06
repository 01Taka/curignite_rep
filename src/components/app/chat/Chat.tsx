import React, { FC } from 'react';
import { ChatData } from '../../../types/firebase/db/chat/chatsTypes';
import { dateTimeToString, FormatRange } from '../../../functions/dateTimeUtils';
import { Avatar } from '@mui/material';
import { cn } from '../../../functions/utils';
import { useAppSelector } from '../../../redux/hooks';
import ChatMessage from './ChatMessage';

interface ChatProps {
    chat: ChatData;
    className?: string;
}

const Chat: FC<ChatProps> = ({ chat, className }) => {
  const { uid } = useAppSelector(state => state.userSlice);

  const formatRange: FormatRange<boolean>[] = [{
    unit: "days",
    value: 0,
    format: "MM/dd HH:mm",
    absolute: true,
    truncate: true,
  }]

  const time = dateTimeToString(chat.createdAt, {}, false, "前", formatRange);
  const isMyChat = chat.createdById ===  uid;

  return (
    <div key={chat.docId} className={cn('flex', isMyChat ? "flex-row-reverse" : "")}>
      <div className='flex'>
        {!isMyChat &&
          <Avatar alt={`${chat.senderName}のアイコン`} src={chat.senderIconUrl} className='mr-1'/>
        }
        <div className='flex flex-col'>
          {!isMyChat &&
            <div>{chat.senderName}</div>
          }
          <ChatMessage content={chat.content} isMyChat={isMyChat} className={className}/>
        </div>
      </div>
      <span className='p-1 self-end text-grayText'>
        {`${time === "" ? "数秒" : time}`}
      </span>
      </div>
  );
};

export default Chat;
