import React, { useEffect, useRef, useState } from "react";
import { getNextPageChatsByRedux, moveToChatRoom } from "../../../functions/redux/chat/reduxChatUtils";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import ChatRoomView from "./ChatRoomView";
import { ChatData, ChatFormData, ChatAttachment } from "../../../types/firebase/db/chat/chatsTypes";
import { sortChatIdMap } from "../../../functions/app/chat/chatUtils";
import serviceFactory from "../../../firebase/db/factory";

interface ChatProps {
    chatRoomId: string;
}

const ChatRoom: React.FC<ChatProps> = ({ chatRoomId }) => {
    const [chat, setChat] = useState<ChatFormData>({ content: "", attachments: [] });
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

    const handleChangeChatContent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChat({
            ...chat,
            content: e.target.value,
        });
    };

    const handleAttachFile = (files: FileList) => {
        const attachments: ChatAttachment[] = Array.from(files).map(file => ({
            type: "file", // 適切なタイプに変更してください
            url: URL.createObjectURL(file),
            fileName: file.name,
            fileSize: file.size,
        }));

        setChat(prevChat => ({
            ...prevChat,
            attachments: [...(prevChat.attachments || []), ...attachments],
        }));
    };

    const handleSendChat = async () => {
        if (uid) {
            setChat({ content: "", attachments: [] });
            const chatService = serviceFactory.createChatRoomChatService();
            await chatService.sendChat(chatRoomId, uid, chat.content, chat.attachments);
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
            chat={chat}
            chats={chats}
            onChangeChatContent={handleChangeChatContent}
            onAttachFile={handleAttachFile}
            onSendChat={handleSendChat}
            onScrollToEnd={getAdditionalChat}
        />
    );
};

export default ChatRoom;
