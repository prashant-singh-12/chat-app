import { useEffect, useState } from 'react';
import axios from 'axios';

export const usePaginatedGroups = () => {
    const [groups, setGroups] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [generalLoaded, setGeneralLoaded] = useState(false);

    const loadGeneralGroup = async () => {
        try {
            const res = await axios.get(`/api/groups/general`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const generalGroup = res.data;
            setGroups(prev => {
                const exists = prev.some(g => g.id === generalGroup.id);
                return exists ? prev : [generalGroup, ...prev];
            });
        } catch (err) {
            console.error("❌ Failed to load general group:", err);
        } finally {
            setGeneralLoaded(true);
        }
    };

    const loadMore = async () => {
        if (loading || !hasMore || !generalLoaded) return;

        setLoading(true);
        try {
            const res = await axios.get(`/api/groups?page=${page}&size=3`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const newGroups = Array.isArray(res.data) ? res.data : [];

            setGroups(prev => {
                const existingIds = new Set(prev.map(g => g.id));
                const uniqueNewGroups = newGroups.filter(g => !existingIds.has(g.id));
                return [...prev, ...uniqueNewGroups];
            });

            if (newGroups.length < 3) {
                setHasMore(false);
            } else {
                setPage(prev => prev + 1);
            }
        } catch (err) {
            console.error("❌ Failed to load paginated groups:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load "general" first
    useEffect(() => {
        loadGeneralGroup();
    }, []);

    // Then start loading others
    useEffect(() => {
        if (generalLoaded) {
            loadMore();
        }
    }, [generalLoaded]);

    return { groups, loadMore, hasMore };
};
