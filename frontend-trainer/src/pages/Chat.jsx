import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Send, Search, User, MoreVertical, Phone, Video, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const ENDPOINT = "https://fitness-tracker-management-system-xi0y.onrender.com";

const Chat = () => {
    const { trainer } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();
    const socket = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('trainerToken');
            const res = await axios.get(`${ENDPOINT}/api/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conversations", error);
            setLoading(false);
        }
    };

    const fetchMessages = async (otherId) => {
        try {
            const token = localStorage.getItem('trainerToken');
            const res = await axios.get(`${ENDPOINT}/api/chat/${otherId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    useEffect(() => {
        if (trainer) {
            socket.current = io(ENDPOINT);
            socket.current.emit("join_room", trainer._id);
        }
        return () => {
            socket.current?.disconnect();
        };
    }, [trainer]);

    useEffect(() => {
        if (!socket.current) return;

        const messageHandler = (newMessageReceived) => {
            if (activeChat && (
                newMessageReceived.senderId === activeChat._id ||
                newMessageReceived.receiverId === activeChat._id
            )) {
                setMessages((prev) => [...prev, newMessageReceived]);
            }
        };

        socket.current.on("receive_message", messageHandler);

        return () => {
            socket.current.off("receive_message", messageHandler);
        };
    }, [activeChat]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const search = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
            try {
                const token = localStorage.getItem('trainerToken');
                const res = await axios.get(`${ENDPOINT}/api/chat/search?query=${searchQuery}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(res.data);
            } catch (error) {
                console.error("Error searching users", error);
            }
        };

        const debounce = setTimeout(() => {
            search();
        }, 500);

        return () => clearTimeout(debounce);
    }, [searchQuery]);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat._id);
        }
    }, [activeChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const tempMsg = {
            _id: Date.now().toString(),
            senderId: trainer._id,
            senderModel: 'Trainer',
            receiverId: activeChat._id,
            receiverModel: activeChat.type || 'User',
            message: newMessage,
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, tempMsg]);
        setNewMessage('');

        try {
            const token = localStorage.getItem('trainerToken');
            await axios.post(`${ENDPOINT}/api/chat/send`, {
                receiverId: activeChat._id,
                receiverModel: activeChat.type || 'User',
                message: tempMsg.message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error sending message", error);
            setMessages((prev) => prev.filter(m => m._id !== tempMsg._id));
            alert("Failed to send message");
        }
    };

    const handleSelectChat = (chat) => {
        setActiveChat(chat);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6 animate-in fade-in duration-500">
            <div className="w-80 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col hidden md:flex">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search anyone..."
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-2.5"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {searchQuery ? (
                        <>
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Search Results</div>
                            {searchResults.length === 0 ? (
                                <div className="text-slate-500 text-center py-4">No results found.</div>
                            ) : (
                                searchResults.map(chat => (
                                    <div
                                        key={chat._id}
                                        onClick={() => handleSelectChat(chat)}
                                        className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                            {chat.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-200 truncate">{chat.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{chat.role} • {chat.email}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    ) : (
                        <>
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Conversations</div>
                            {loading ? (
                                <div className="text-slate-500 text-center py-4">Loading contacts...</div>
                            ) : conversations.length === 0 ? (
                                <div className="text-slate-500 text-center py-4">No conversations yet.</div>
                            ) : (
                                conversations.map(chat => (
                                    <div
                                        key={chat._id}
                                        onClick={() => setActiveChat(chat)}
                                        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors
                                            ${activeChat?._id === chat._id ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-slate-800'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                            {chat.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-semibold truncate ${activeChat?._id === chat._id ? 'text-cyan-400' : 'text-slate-200'}`}>
                                                {chat.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 truncate">{chat.email}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                                    {activeChat.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{activeChat.name}</h3>
                                    <span className="flex items-center text-xs text-emerald-400">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-400">
                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Video size={20} /></button>
                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-950/30">
                            {messages.length === 0 ? (
                                <div className="text-center text-slate-500 py-10">
                                    <p>Start the conversation with {activeChat.name}!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.senderModel === 'Trainer';
                                    return (
                                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl p-3 px-4 ${isMe
                                                ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg shadow-cyan-900/20'
                                                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                                                <p className="text-sm">{msg.message}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-cyan-200' : 'text-slate-500'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={scrollRef} />
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-950/30">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Select a Conversation</h3>
                        <p className="max-w-xs">Choose a client from the list on the left to start sending messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
