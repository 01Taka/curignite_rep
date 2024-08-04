import React, { FC, useEffect, useRef, useState } from 'react';
import { ChatData, ChatFormData } from '../../../types/firebase/db/chat/chatsTypes';
import Chat from './Chat';
import ChatInput from '../../../components/input/message/ChatInput';

interface ChatRoomViewProps {
    chat: ChatFormData;
    chats: ChatData[];
    onChangeChatContent: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAttachFile: (files: FileList) => void;
    onSendChat: () => void;
    onScrollToEnd: () => void;
}

const ChatRoomView: FC<ChatRoomViewProps> = ({ chat, chats, onChangeChatContent, onAttachFile, onSendChat, onScrollToEnd }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollEndRef = useRef<HTMLDivElement>(null);
    const [scrolledToEnd, setScrolledToEnd] = useState(false);
    const [calledOnScrollToEnd, setCalledOnScrollToEnd] = useState(false);

    const handleScroll = React.useCallback(() => {
        if (containerRef.current) {
            const { scrollTop } = containerRef.current;
            if (!calledOnScrollToEnd && scrolledToEnd && scrollTop < 50) {
                onScrollToEnd();
                setCalledOnScrollToEnd(true);
            }
        }
    }, [scrolledToEnd, calledOnScrollToEnd, onScrollToEnd]);
    

    useEffect(() => {
        setCalledOnScrollToEnd(false);
    }, [chats]);

    useEffect(() => {
        const container = containerRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef, scrolledToEnd, handleScroll]);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: "auto", block: "start" });
    };

    useEffect(() => {
        if (chats.length > 0 && !scrolledToEnd) {
            scrollToRef(scrollEndRef);
            setScrolledToEnd(true);
        }
    }, [chats, scrolledToEnd]);

    return (
        <div ref={containerRef} style={{ overflowY: 'auto', maxHeight: '100vh' }}>
            <div className='flex flex-col'>
                {chats.map((chat) => (
                    <Chat key={chat.docId} chat={chat} />
                ))}
                <div ref={scrollEndRef} />
            </div>
            <ChatInput
                chat={chat}
                onChangeChatContent={onChangeChatContent}
                onAttachFile={onAttachFile}
                onSendChat={onSendChat}
                placeholder='メッセージを入力'
            />
        </div>
    );
};

export default ChatRoomView;
