
import { useRef, useState } from 'react';
import axios from 'axios';

const PAGE_SIZE = 10;

export const usePaginatedMessages = () => {
    const messageMapRef = useRef(new Map());
    const [_, forceRender] = useState(0); // trigger re-render

    const loadingMap = useRef(new Map());
    const hasMoreMap = useRef(new Map());

    const loadOlderMessages = async (targetId, isChannel) => {
        if (!targetId) return;
        if (loadingMap.current.get(targetId)) return;

        const existing = messageMapRef.current.get(targetId) || [];
        const lastMessage = existing[0]; // top = oldest
        const before = lastMessage?.timestamp;

        console.log("⏳ Last message timestamp:", before);
        loadingMap.current.set(targetId, true);

        try {
            const res = await axios.get('http://localhost:8080/api/messages', {
                params: {
                    targetId,
                    isGroup: isChannel,
                    size: PAGE_SIZE,
                    ...(before ? { before } : {}),
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = res.data ?? [];
            const newMessages = [...data].reverse(); // oldest → newest

            // 🔐 Deduplication during pagination
            const existingIds = new Set(existing.map(m => m.id));
            const filtered = newMessages.filter(m => !existingIds.has(m.id));

            messageMapRef.current.set(targetId, [...filtered, ...existing]);
            hasMoreMap.current.set(targetId, data.length === PAGE_SIZE);

            forceRender(n => n + 1);
        } catch (err) {
            console.error("❌ Error loading messages:", err);
        } finally {
            loadingMap.current.set(targetId, false);
        }
    };

    const addMessageToTarget = (targetKey, msg) => {
        const msgs = messageMapRef.current.get(targetKey) || [];
        const exists = msgs.some(m => m.id === msg.id);
        if (!exists) {
            messageMapRef.current.set(targetKey, [...msgs, msg]);
            forceRender(n => n + 1);
        }
    };

    const messagesFor = (targetId) => messageMapRef.current.get(targetId) || [];
    const isLoadingFor = (targetId) => loadingMap.current.get(targetId) || false;
    const hasMoreFor = (targetId) => hasMoreMap.current.get(targetId) ?? true;

    return {
        loadOlderMessages,
        addMessageToTarget,
        messagesFor,
        isLoadingFor,
        hasMoreFor,
    };
};
