import React, { useEffect, useRef, useState } from "react";
import { getNextPageChatsByRedux, moveToChatRoom } from "../../../functions/redux/chat/reduxChatUtils";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import ChatRoomView from "./ChatRoomView";
import { sortChatIdMap } from "../../../functions/app/chat/chatUtils";
import serviceFactory from "../../../firebase/db/factory";
import { ChatFormState } from "../../input/message/ChatInput";
import { ChatData } from "../../../types/firebase/db/chat/chatRoomStructure";
import useFormState from "../../../features/hooks/form/useFormState";

interface ChatProps {
    chatRoomId: string;
}

const ChatRoom: React.FC<ChatProps> = ({ chatRoomId }) => {
    const { formState, onChangeFormState, resetFormState } = useFormState<ChatFormState>({ content: "", files: [] });
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
            resetFormState();
            const chatService = serviceFactory.createChatRoomChatService();
            await chatService.sendChat(chatRoomId, uid, formState.content, formState.files, formState.replyTo);
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
            chatState={formState}
            chats={chats}
            onChatStateChange={onChangeFormState}
            onSendChat={handleSendChat}
            onScrollToEnd={getAdditionalChat}
        />
    );
};

export default ChatRoom;
