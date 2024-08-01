import React, { FC, useEffect, useRef } from 'react';
import { ChatData } from '../../../types/firebase/db/chat/chatsTypes';
import Chat from './Chat';

interface ChatRoomViewProps {
    chats: ChatData[];
    chatEndRef: React.RefObject<HTMLDivElement>;
    onScrollToEnd: () => void;
}

const ChatRoomView: FC<ChatRoomViewProps> = ({ chats, chatEndRef, onScrollToEnd }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            if (scrollHeight - scrollTop === clientHeight) {
                onScrollToEnd();
            }
        }
    };

    useEffect(() => {
        containerRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ overflowY: 'auto', maxHeight: '100vh' }}>
            <div>
                {chats.map((chat) => (
                    <Chat key={chat.docId} chat={chat} />
                ))}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
};

export default ChatRoomView;
