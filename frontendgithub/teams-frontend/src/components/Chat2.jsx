// Chat.jsx
import React, { useState, useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { logout, getEmailFromToken } from '../utils/auth';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { usePaginatedUsers } from '../hooks/usePaginatedUsers';
import { usePaginatedGroups } from '../hooks/usePaginatedGroups';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Chat2 = ({ currentUserName }) => {
    const [input, setInput] = useState('');
    const currentUserEmail = getEmailFromToken();
    const listRef = useRef();

    const {
        messages,
        sendMessage,
        selectedTarget,
        setSelectedTarget,
        isChannel,
        setIsChannel,
    } = useChatWebSocket(currentUserName);

    const { users, loadMore: loadMoreUsers, hasMore: hasMoreUsers } = usePaginatedUsers();
    const { groups, loadMore: loadMoreGroups, hasMore: hasMoreGroups } = usePaginatedGroups();
    const groupListRef = useRef();
    const userListRef = useRef();
    const navigate = useNavigate();
    console.log("Cheking the env now ",process.env.NODE_ENV);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedTarget) return;

        const msgObj = {
            content: input,
            receiverId: selectedTarget,
            type: isChannel ? 'GROUP' : 'PRIVATE',
        };

        sendMessage(msgObj);
        setInput('');
    };

    useEffect(() => {
        if (listRef.current && messages.length > 0) {
            listRef.current.scrollToItem(messages.length - 1, 'end');
        }
    }, [messages]);

    const handleGroupScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        console.log("handlegrpupscorll callled here ",bottom);
        if (bottom && hasMoreGroups) {
            console.log("inside handle group scroll if contiiosdnsjnd");
            loadMoreGroups();
        }
    };

    const handleUserScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && hasMoreUsers) loadMoreUsers();
    };

    return (
        <div className="h-screen flex flex-col">
            <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold">Team Chat - {currentUserName}</h1>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
                >
                    Logout
                </button>
            </header>

            <div className="flex flex-1">
                <aside className="w-64 bg-gray-100 p-4 hidden md:flex flex-col gap-4">
                    <div className="overflow-auto max-h-30" onScroll={handleGroupScroll} ref={groupListRef}>
                        <p className="text-gray-700 font-semibold mb-2">Channels</p>
                        {groups.map((group) => (
                            <button
                                key={group.name}
                                className={`block w-full text-left px-2 py-1 rounded mb-1 ${
                                    selectedTarget === group.name && isChannel ? 'bg-blue-200' : 'hover:bg-gray-200'
                                }`}
                                onClick={() => {

                                    setSelectedTarget(group.name);
                                    setIsChannel(true);
                                }}
                            >
                                #{group.name}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-auto" onScroll={handleUserScroll} ref={userListRef}>
                        <p className="text-gray-700 font-semibold mb-2">Users</p>
                        {users.map((user) => (
                            <button
                                key={user.userName}
                                className={`block w-full text-left px-2 py-1 rounded mb-1 ${
                                    selectedTarget === user.userName && !isChannel ? 'bg-blue-200' : 'hover:bg-gray-200'
                                }`}
                                onClick={() => {
                                    setSelectedTarget(user.userName);
                                    setIsChannel(false);
                                }}
                            >
                                @{user.userName}
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="flex-1 flex flex-col justify-between p-4 bg-gray-50">
                    <div className="flex-1 overflow-y-auto mb-4">
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    itemCount={messages.length}
                                    itemSize={80}
                                    width={width}
                                    ref={listRef}
                                >
                                    {({ index, style }) => {
                                        const msg = messages[index];
                                        const isMine = msg.fromUserId === currentUserEmail;

                                        return (
                                            <div
                                                style={{
                                                    ...style,
                                                    display: 'flex',
                                                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                                                    padding: '4px 8px',
                                                }}
                                            >
                                                <div
                                                    className={`p-2 rounded shadow max-w-lg w-fit ${
                                                        isMine ? 'bg-blue-100' : 'bg-white'
                                                    }`}
                                                >
                                                    <p className="text-sm text-gray-600">
                                                        <strong>
                                                            {msg.type === 'PRIVATE' ? 'Private' : 'Group'} from{' '}
                                                            {msg.fromUserId}
                                                        </strong>
                                                    </p>
                                                    <p>{msg.content}</p>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </List>
                            )}
                        </AutoSizer>
                    </div>

                    {selectedTarget && (
                        <div className="text-sm text-gray-600 mb-2">
                            Chatting with {isChannel ? `#${selectedTarget}` : `@${selectedTarget}`}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            disabled={!selectedTarget}
                        >
                            Send
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Chat2;
