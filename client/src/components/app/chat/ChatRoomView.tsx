import React, { FC, useEffect, useRef, useState } from 'react';
import Chat from './Chat';
import ChatInput, { ChatFormState } from '../../input/message/ChatInput';
import { ChatData } from '../../../types/firebase/db/chat/chatRoomStructure';
import { FormStateChangeFunc } from '../../../types/util/componentsTypes';


interface ChatRoomViewProps {
    chatState: ChatFormState;
    chats: ChatData[];
    onChatStateChange: FormStateChangeFunc;
    onSendChat: () => void;
    onScrollToEnd: () => void;
}

const ChatRoomView: FC<ChatRoomViewProps> = ({ chatState, chats, onChatStateChange, onSendChat, onScrollToEnd }) => {
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
        <div ref={containerRef} className='overflow-auto h-full'>
            <div className='flex max-w-4xl flex-col space-y-8 mb-16'>
                {chats.map((chat) => (
                    <Chat key={chat.docId} chat={chat} />
                ))}
                <div ref={scrollEndRef} />
            </div>
            <div className='fixed bottom-0 flex justify-center w-full bg-primaryBase p-1 pb-4'>
                <ChatInput
                    formState={chatState}
                    onFormStateChange={onChatStateChange}
                    onSendChat={onSendChat}
                    placeholder='メッセージを入力'
                />
            </div>
        </div>
    );
};

export default ChatRoomView;
