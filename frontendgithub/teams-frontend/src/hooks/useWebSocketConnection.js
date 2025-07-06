import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';

export const useWebSocketConnection = (token, onMessage) => {
    const stompClientRef = useRef(null);
    const messageHandlerRef = useRef(onMessage); // holds latest version

    // Always update ref to hold the latest message handler
    useEffect(() => {
        messageHandlerRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log('🟢 Connected to STOMP');

                client.subscribe('/user/queue/messages', (message) => {
                    const msg = JSON.parse(message.body);
                    // Use latest handler from ref
                    messageHandlerRef.current(msg);
                });
            },
            onStompError: (frame) => {
                console.error('❌ STOMP error', frame);
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [token]);

    return stompClientRef;
};
