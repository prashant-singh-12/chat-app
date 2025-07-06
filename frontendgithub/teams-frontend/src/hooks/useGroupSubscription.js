import { useEffect, useRef } from 'react';

export const useGroupSubscription = (stompClientRef, selectedGroupId, isChannel, handleGroupMessage) => {
    const currentGroupSubRef = useRef(null);

    useEffect(() => {
        if (!stompClientRef.current?.connected || !selectedGroupId || !isChannel) return;

        const sub = stompClientRef.current.subscribe(`/topic/group/${selectedGroupId}`, handleGroupMessage);

        if (currentGroupSubRef.current) {
            currentGroupSubRef.current.unsubscribe();
        }

        currentGroupSubRef.current = sub;

        return () => {
            if (currentGroupSubRef.current) {
                currentGroupSubRef.current.unsubscribe();
                currentGroupSubRef.current = null;
            }
        };
    }, [selectedGroupId, isChannel]);
};
