import React, { useEffect, useRef, useState } from "react";
import { getNextPageChatsByRedux, moveToChatRoom } from "../../../functions/redux/chat/reduxChatUtils";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import ChatRoomView from "./ChatRoomView";
import { sortChatIdMap } from "../../../functions/app/chat/chatUtils";
import serviceFactory from "../../../firebase/db/factory";
import { ChatFormState } from "../../input/message/ChatInput";
import { ChatData } from "../../../types/firebase/db/chat/chatRoomStructure";
import { handleFormStateChange } from "../../../functions/utils";

interface ChatProps {
    chatRoomId: string;
}

const ChatRoom: React.FC<ChatProps> = ({ chatRoomId }) => {
    const [chatState, setChatState] = useState<ChatFormState>({ content: "", files: [] });
    const [chats, setChats] = useState<ChatData[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const { uid } = useAppSelector(state => state.userSlice);

    useEffect(() => {
        const moveRoom = async () => {
            const chats = await moveToChatRoom(dispatch, chatRoomId);
            setChats(chats);
        };
        moveRoom();
    }, [chatRoomId, dispatch]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    const handleSendChat = async () => {
        if (uid) {
            setChatState({ content: "", files: [] });
            const chatService = serviceFactory.createChatRoomChatService();
            await chatService.sendChat(chatRoomId, uid, chatState.content, chatState.files, chatState.replyTo);
        }
    };

    const getAdditionalChat = async () => {
        const chatIdMap = await getNextPageChatsByRedux(dispatch);
        if (chatIdMap) {
            const sortedChats = sortChatIdMap(chatIdMap);
            setChats(sortedChats);
        }
    };

    return (
        <ChatRoomView
            chatState={chatState}
            chats={chats}
            onChatStateChange={(e) => handleFormStateChange(e, setChatState)}
            onSendChat={handleSendChat}
            onScrollToEnd={getAdditionalChat}
        />
    );
};

export default ChatRoom;
