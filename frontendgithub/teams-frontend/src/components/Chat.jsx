//
// // Chat.jsx
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { logout, getEmailFromToken } from '../utils/auth';
// import { useChatWebSocket } from '../hooks/useChatWebSocket';
// import { usePaginatedUsers } from '../hooks/usePaginatedUsers';
// import { usePaginatedGroups } from '../hooks/usePaginatedGroups';
// import { FixedSizeList as List } from 'react-window';
// import AutoSizer from 'react-virtualized-auto-sizer';
//
// const Chat = ({ currentUserName }) => {
//     const [input, setInput] = useState('');
//     const currentUserEmail = getEmailFromToken();
//     const listRef = useRef();
//     const outerRef = useRef();
//     const hasSetDefault = useRef(false);
//     const isScrollUpLoading = useRef(false);
//     const prevMessagesLengthRef = useRef(0);
//
//     const {
//         messages,
//         sendMessage,
//         loadOlderMessages,
//         selectedTarget,
//         setSelectedTarget,
//         selectedTargetId,
//         setSelectedTargetId,
//         isChannel,
//         setIsChannel,
//         isLoadingFor,
//         hasMoreFor,
//     } = useChatWebSocket(currentUserName);
//
//     const { users, loadMore: loadMoreUsers, hasMore: hasMoreUsers } = usePaginatedUsers();
//     const { groups, loadMore: loadMoreGroups, hasMore: hasMoreGroups } = usePaginatedGroups();
//
//     const navigate = useNavigate();
//
//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!input.trim() || !selectedTargetId) return;
//
//         const msgObj = {
//             content: input,
//             receiverId: selectedTargetId,
//             type: isChannel ? 'GROUP' : 'PRIVATE',
//         };
//
//         sendMessage(msgObj);
//         setInput('');
//     };
//
//     useEffect(() => {
//         if (!hasSetDefault.current && groups.length > 0 && !selectedTargetId) {
//             const generalGroup = groups.find(g => g.name === "general");
//             if (generalGroup) {
//                 setSelectedTarget(generalGroup.name);
//                 setSelectedTargetId(generalGroup.id);
//                 setIsChannel(true);
//                 loadOlderMessages(generalGroup.id, true);
//                 hasSetDefault.current = true;
//             }
//         }
//     }, [groups, selectedTargetId]);
//
//     useEffect(() => {
//         if (!listRef.current || messages.length === 0) return;
//
//         const prevLen = prevMessagesLengthRef.current;
//         const currLen = messages.length;
//
//         if (currLen > prevLen) {
//             const delta = currLen - prevLen;
//
//             if (isScrollUpLoading.current) {
//                 // Maintain scroll position after prepending
//                 requestAnimationFrame(() => {
//                     listRef.current.scrollToItem(delta, 'start');
//                 });
//             } else {
//                 // Scroll to bottom when sending/receiving new messages
//                 listRef.current.scrollToItem(currLen - 1, 'end');
//             }
//         }
//
//         prevMessagesLengthRef.current = currLen;
//         isScrollUpLoading.current = false;
//     }, [messages]);
//
//     const handleMessageScroll = useCallback(() => {
//         const scrollTop = outerRef.current?.scrollTop;
//         if (scrollTop === 0 && hasMoreFor(selectedTargetId) && !isLoadingFor(selectedTargetId)) {
//             isScrollUpLoading.current = true;
//             loadOlderMessages(selectedTargetId, isChannel);
//         }
//     }, [selectedTargetId, isChannel]);
//
//     return (
//         <div className="h-screen flex flex-col">
//             <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
//                 <h1 className="text-xl font-bold">Team Chat - {currentUserName}</h1>
//                 <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
//                     Logout
//                 </button>
//             </header>
//
//             <div className="flex flex-1">
//                 {/* Sidebar */}
//                 <aside className="w-64 bg-gray-100 p-4 hidden md:flex flex-col gap-4">
//                     <div className="overflow-auto max-h-30">
//                         <p className="text-gray-700 font-semibold mb-2">Channels</p>
//                         {groups.map(group => (
//                             <button
//                                 key={group.id}
//                                 className={`block w-full text-left px-2 py-1 rounded mb-1 ${
//                                     selectedTarget === group.name && isChannel ? 'bg-blue-200' : 'hover:bg-gray-200'
//                                 }`}
//                                 onClick={() => {
//                                     setSelectedTargetId(group.id);
//                                     setSelectedTarget(group.name);
//                                     setIsChannel(true);
//                                     loadOlderMessages(group.id, true);
//                                 }}
//                             >
//                                 #{group.name}
//                             </button>
//                         ))}
//                     </div>
//
//                     <div className="overflow-auto">
//                         <p className="text-gray-700 font-semibold mb-2">Users</p>
//                         {users.map(user => (
//                             <button
//                                 key={user.userName}
//                                 className={`block w-full text-left px-2 py-1 rounded mb-1 ${
//                                     selectedTarget === user.userName && !isChannel ? 'bg-blue-200' : 'hover:bg-gray-200'
//                                 }`}
//                                 onClick={() => {
//                                     setSelectedTargetId(user.email);
//                                     setSelectedTarget(user.userName);
//                                     setIsChannel(false);
//                                     loadOlderMessages(user.email, false);
//                                 }}
//                             >
//                                 @{user.userName}
//                             </button>
//                         ))}
//                     </div>
//                 </aside>
//
//                 {/* Main Chat */}
//                 <main className="flex-1 flex flex-col justify-between p-4 bg-gray-50">
//                     <div className="flex-1 mb-4" style={{ minHeight: '150px' }}>
//                         <AutoSizer>
//                             {({ height, width }) => (
//                                 <List
//                                     height={height}
//                                     width={width}
//                                     itemCount={messages.length}
//                                     itemSize={80}
//                                     ref={listRef}
//                                     outerRef={outerRef}
//                                     onScroll={handleMessageScroll}
//                                 >
//                                     {({ index, style }) => {
//                                         const msg = messages[index];
//                                         const isMine = msg.fromUserId === currentUserEmail;
//
//                                         return (
//                                             <div
//                                                 style={{
//                                                     ...style,
//                                                     display: 'flex',
//                                                     justifyContent: isMine ? 'flex-end' : 'flex-start',
//                                                     padding: '4px 8px',
//                                                 }}
//                                             >
//                                                 <div
//                                                     className={`p-2 rounded shadow max-w-lg w-fit ${
//                                                         isMine ? 'bg-blue-100' : 'bg-white'
//                                                     }`}
//                                                 >
//                                                     <p className="text-sm text-gray-600">
//                                                         <strong>
//                                                             {msg.type === 'PRIVATE' ? 'Private' : 'Group'} from {msg.fromUserId}
//                                                         </strong>
//                                                     </p>
//                                                     <p>{msg.content}</p>
//                                                 </div>
//                                             </div>
//                                         );
//                                     }}
//                                 </List>
//                             )}
//                         </AutoSizer>
//                     </div>
//
//                     {selectedTarget && (
//                         <div className="text-sm text-gray-600 mb-2">
//                             Chatting with {isChannel ? `#${selectedTarget}` : `@${selectedTarget}`}
//                         </div>
//                     )}
//
//                     <form onSubmit={handleSubmit} className="flex gap-2">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Type your message..."
//                             className="flex-1 p-2 border border-gray-300 rounded"
//                         />
//                         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!selectedTarget}>
//                             Send
//                         </button>
//                     </form>
//                 </main>
//             </div>
//         </div>
//     );
// };
//
// export default Chat;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getEmailFromToken } from '../utils/auth';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { usePaginatedUsers } from '../hooks/usePaginatedUsers';
import { usePaginatedGroups } from '../hooks/usePaginatedGroups';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Chat = ({ currentUserName }) => {
    const [input, setInput] = useState('');
    const currentUserEmail = getEmailFromToken();
    const listRef = useRef();
    const outerRef = useRef();
    const hasSetDefault = useRef(false);
    const isScrollUpLoading = useRef(false);
    const prevMessagesLengthRef = useRef(0);
    const initialScrollDoneMap = useRef(new Map());

    const {
        messages,
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
    } = useChatWebSocket(currentUserName);

    const { users, loadMore: loadMoreUsers, hasMore: hasMoreUsers } = usePaginatedUsers();
    const { groups, loadMore: loadMoreGroups, hasMore: hasMoreGroups } = usePaginatedGroups();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedTargetId) return;

        const msgObj = {
            content: input,
            receiverId: selectedTargetId,
            type: isChannel ? 'GROUP' : 'PRIVATE',
        };

        sendMessage(msgObj);
        setInput('');
    };

    useEffect(() => {
        if (!hasSetDefault.current && groups.length > 0 && !selectedTargetId) {
            const generalGroup = groups.find(g => g.name === "general");
            if (generalGroup) {
                setSelectedTarget(generalGroup.name);
                setSelectedTargetId(generalGroup.id);
                setIsChannel(true);
                loadOlderMessages(generalGroup.id, true);
                hasSetDefault.current = true;
            }
        }
    }, [groups, selectedTargetId]);

    useEffect(() => {
        if (!listRef.current || !selectedTargetId || messages.length === 0) return;

        const alreadyScrolled = initialScrollDoneMap.current.get(selectedTargetId);
        const prevLen = prevMessagesLengthRef.current;
        const currLen = messages.length;

        if (!alreadyScrolled) {
            requestAnimationFrame(() => {
                listRef.current.scrollToItem(currLen - 1, 'end');
                initialScrollDoneMap.current.set(selectedTargetId, true);
            });
        } else if (currLen > prevLen && isScrollUpLoading.current) {
            const delta = currLen - prevLen;
            listRef.current.scrollToItem(delta, 'start');
        }

        prevMessagesLengthRef.current = currLen;
        isScrollUpLoading.current = false;
    }, [messages, selectedTargetId]);

    const handleMessageScroll = useCallback(() => {
        const scrollTop = outerRef.current?.scrollTop;
        if (scrollTop === 0 && hasMoreFor(selectedTargetId) && !isLoadingFor(selectedTargetId)) {
            isScrollUpLoading.current = true;
            loadOlderMessages(selectedTargetId, isChannel);
        }
    }, [selectedTargetId, isChannel]);

    const handleSelectTarget = (id, name, isGroup) => {
        setSelectedTargetId(id);
        setSelectedTarget(name);
        setIsChannel(isGroup);
        initialScrollDoneMap.current.set(id, false);
        loadOlderMessages(id, isGroup);
    };

    return (
        <div className="h-screen flex flex-col">
            <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold">Team Chat - {currentUserName}</h1>
                <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
                    Logout
                </button>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-100 p-4 hidden md:flex flex-col gap-4">
                    <div className="overflow-auto max-h-30">
                        <p className="text-gray-700 font-semibold mb-2">Channels</p>
                        {groups.map(group => (
                            <button
                                key={group.id}
                                className={`block w-full text-left px-2 py-1 rounded mb-1 ${
                                    selectedTarget === group.name && isChannel ? 'bg-blue-200' : 'hover:bg-gray-200'
                                }`}
                                onClick={() => handleSelectTarget(group.id, group.name, true)}
                            >
                                #{group.name}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-auto">
                        <p className="text-gray-700 font-semibold mb-2">Users</p>
                        {users.map(user => (
                            <button
                                key={user.userName}
                                className={`block w-full text-left px-2 py-1 rounded mb-1 ${
                                    selectedTarget === user.userName && !isChannel ? 'bg-blue-200' : 'hover:bg-gray-200'
                                }`}
                                onClick={() => handleSelectTarget(user.email, user.userName, false)}
                            >
                                @{user.userName}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Chat */}
                <main className="flex-1 flex flex-col justify-between p-4 bg-gray-50">
                    <div className="flex-1 mb-4" style={{ minHeight: '150px' }}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    width={width}
                                    itemCount={messages.length}
                                    itemSize={80}
                                    ref={listRef}
                                    outerRef={outerRef}
                                    onScroll={handleMessageScroll}
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
                                                            {msg.type === 'PRIVATE' ? 'Private' : 'Group'} from {msg.fromUserId}
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
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!selectedTarget}>
                            Send
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Chat;

