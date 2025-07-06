import { useState } from 'react';
import { getEmailFromToken } from '../utils/auth';
import { useWebSocketConnection } from './useWebSocketConnection';
import { useGroupSubscription } from './useGroupSubscription';
import { usePaginatedMessages } from './usePaginatedMessages';

export const useChatWebSocket = (currentUserName) => {
    const [selectedTarget, setSelectedTarget] = useState(null);      // display name: group.name or user.userName
    const [selectedTargetId, setSelectedTargetId] = useState(null);  // actual id: groupId or user email
    const [isChannel, setIsChannel] = useState(true);                // true for group, false for private

    const currentUserEmail = getEmailFromToken();

    const {
        messagesFor,
        addMessageToTarget,
        loadOlderMessages,
        isLoadingFor,
        hasMoreFor,
    } = usePaginatedMessages();

    // WebSocket connection and message handler
    const stompClientRef = useWebSocketConnection(
        localStorage.getItem('token'),
        (msg) => {
            const targetKey =
                msg.type === 'PRIVATE'
                    ? msg.fromUserId === currentUserEmail
                        ? msg.receiverId  // I sent it to someone
                        : msg.fromUserId  // they sent it to me
                    : msg.receiverId;      // for group chats: receiverId is groupId

            addMessageToTarget(targetKey, msg);
        }
    );

    // Subscription to selected group
    useGroupSubscription(
        stompClientRef,
        selectedTargetId,
        isChannel,
        (message) => {
            const msg = JSON.parse(message.body);
            addMessageToTarget(msg.receiverId, msg);
        }
    );

    const sendMessage = (msgObj) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(msgObj),
            });
        }
    };

    return {
        messages: messagesFor(selectedTargetId),
        sendMessage,
        loadOlderMessages,
        selectedTarget,
        setSelectedTarget,
        selectedTargetId,
        setSelectedTargetId,
        isChannel,
        setIsChannel,
        isLoadingFor,
        hasMoreFor,
    };
};
