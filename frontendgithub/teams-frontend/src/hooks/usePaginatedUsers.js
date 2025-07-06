import { useState, useEffect, useCallback,useRef } from 'react';
import axios from 'axios';

const PAGE_SIZE = 10;

export function usePaginatedUsers() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const hasFetchedRef = useRef(false);

    const fetchUsers = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await axios.get(`/api/recent/users?page=${page}&size=${PAGE_SIZE}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const newUsers = res.data || [];
            console.log("Haha onload users are ",newUsers);
            setUsers((prev) => {
                const userSet = new Set(prev);
                newUsers.forEach((user) => userSet.add(user));
                return Array.from(userSet);
            });

            if (newUsers.length < PAGE_SIZE) {
                setHasMore(false);
            } else {
                setPage((prev) => prev + 1);
            }
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);

    // Initial load
    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchUsers();
        }

    }, []);

    return { users, fetchUsers, hasMore, loading };
}
