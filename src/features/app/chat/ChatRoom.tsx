import React, { useEffect, useRef, useState } from "react";
import { getNextPageChatsByRedux, moveToChatRoom } from "../../../functions/redux/chat/reduxChatUtils";
import { useAppDispatch } from "../../../redux/hooks";
import ChatRoomView from "./ChatRoomView";
import { ChatData, ChatIdMap } from "../../../types/firebase/db/chat/chatsTypes";
import { sortChatIdMap } from "../../../functions/app/chat/chatUtils";

interface ChatProps {
    chatRoomId: string;
}

const ChatRoom: React.FC<ChatProps> = ({ chatRoomId }) => {
    const [chats, setChats] = useState<ChatData[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const moveRoom = async () => {
            const chats = await moveToChatRoom(dispatch, chatRoomId);
            handleSetChat(chats);
        };
        moveRoom();
    }, [chatRoomId, dispatch]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    const getAdditionalChat = async () => {
        const chats = await getNextPageChatsByRedux(dispatch);
        handleSetChat(chats);
    };

    const handleSetChat = (chatIdMap: ChatIdMap | null) => {
        if (chatIdMap) {
            const sortedChats = sortChatIdMap(chatIdMap);
            setChats(prevChats => [...prevChats, ...sortedChats]);
        }
    };

    return (
        <ChatRoomView
            chats={chats}
            chatEndRef={chatEndRef}
            onScrollToEnd={getAdditionalChat}
        />
    );
};

export default ChatRoom;
