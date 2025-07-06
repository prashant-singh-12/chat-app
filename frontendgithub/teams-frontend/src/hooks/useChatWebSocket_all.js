import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';
import { getEmailFromToken } from '../utils/auth.js';

export const useChatWebSocket = (currentUserName) => {
    const [messageMap, setMessageMap] = useState(new Map());
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [selectedTargetId, setSelectedTargetId] = useState(null); // groupId for group chat
    const [isChannel, setIsChannel] = useState(true);
    const stompClientRef = useRef(null);
    const currentGroupSubRef = useRef(null);
    const currentUserEmail = getEmailFromToken();

    const messages = messageMap.get(selectedTargetId || selectedTarget) || [];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: async () => {
                console.log('🟢 STOMP connected');
                console.log("The connected user is ",currentUserName);
                // 🟣 Subscribe to PRIVATE messages (to this user)
                client.subscribe('/user/queue/messages', (message) => {
                    const msg = JSON.parse(message.body);
                    const targetKey =
                        msg.type === 'PRIVATE'
                            ? msg.fromUserId === currentUserEmail
                                ? msg.receiverId
                                : msg.fromUserId
                            : msg.receiverId; // for GROUP, use groupId

                    setMessageMap((prev) => {
                        const newMap = new Map(prev);
                        const msgs = newMap.get(targetKey) || [];
                        newMap.set(targetKey, [...msgs, msg]);
                        return newMap;
                    });
                });

            },
            onStompError: (frame) => {
                console.error('❌ STOMP error:', frame);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    // 🔁 Subscribe dynamically to group topics
    useEffect(() => {
        if (!stompClientRef.current?.connected || !isChannel || !selectedTargetId) return;

        const sub = stompClientRef.current.subscribe(`/topic/group/${selectedTargetId}`, (message) => {
            const msg = JSON.parse(message.body);
            setMessageMap((prev) => {
                const newMap = new Map(prev);
                const msgs = newMap.get(selectedTargetId) || [];
                newMap.set(selectedTargetId, [...msgs, msg]);
                return newMap;
            });
        });

        // Unsubscribe old group topic if changed
        return () => {
            if (currentGroupSubRef.current) {
                currentGroupSubRef.current.unsubscribe();
            }
            currentGroupSubRef.current = sub;
        };
    }, [selectedTarget, isChannel]);

    const sendMessage = (msgObj) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(msgObj),
            });
        }
    };

    return {
        messages,
        sendMessage,
        selectedTarget,
        selectedTargetId,
        setSelectedTarget,
        setSelectedTargetId,
        isChannel,
        setIsChannel,
    };
};
