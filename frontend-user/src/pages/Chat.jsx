import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Send, Search, Phone, Video, MoreVertical, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const ENDPOINT = "https://fitness-tracker-management-system-xi0y.onrender.com";

const Chat = () => {
    const { user } = useContext(AuthContext);
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
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
            const res = await axios.get(`${ENDPOINT}/api/chat/${otherId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    useEffect(() => {
        if (user) {
            socket.current = io(ENDPOINT);
            socket.current.emit("join_room", user._id);
        }
        return () => {
            socket.current?.disconnect();
        };
    }, [user]);

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
                const token = localStorage.getItem('token');
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
            senderId: user._id,
            senderModel: 'User',
            receiverId: activeChat._id,
            receiverModel: activeChat.type || 'Trainer',
            message: newMessage,
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, tempMsg]);
        setNewMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${ENDPOINT}/api/chat/send`, {
                receiverId: activeChat._id,
                receiverModel: activeChat.type || 'Trainer',
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
        <div className="p-4 md:p-8 h-screen pt-20 box-border">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex overflow-hidden">
                <div className={`w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search conversations..."
                                className="bg-slate-100 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                                            className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                                {chat.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-slate-700 truncate">{chat.name}</h4>
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
                                    <div className="text-slate-500 text-center py-4">Loading chats...</div>
                                ) : conversations.length === 0 ? (
                                    <div className="text-slate-500 text-center py-8 px-4">
                                        <p className="mb-2">No conversations yet.</p>
                                        <p className="text-xs">Once you are assigned a trainer, they will appear here.</p>
                                    </div>
                                ) : (
                                    conversations.map(chat => (
                                        <div
                                            key={chat._id}
                                            onClick={() => setActiveChat(chat)}
                                            className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all
                                                ${activeChat?._id === chat._id ? 'bg-primary-50 border border-primary-100' : 'hover:bg-white hover:shadow-sm'}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                                {chat.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-semibold truncate ${activeChat?._id === chat._id ? 'text-primary-700' : 'text-slate-700'}`}>
                                                    {chat.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 truncate">{chat.specialization || 'Trainer'}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className={`flex-1 flex flex-col bg-slate-50/50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
                                <div className="flex items-center space-x-3">
                                    <button
                                        className="md:hidden text-slate-500"
                                        onClick={() => setActiveChat(null)}
                                    >
                                        Back
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
                                        {activeChat.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{activeChat.name}</h3>
                                        <span className="flex items-center text-xs text-emerald-500 font-medium">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                                            Online
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-slate-400">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Phone size={20} /></button>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Video size={20} /></button>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical size={20} /></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {messages.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10">
                                        <p>Say hello to your trainer!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.senderModel === 'User';
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl p-3 px-4 shadow-sm ${isMe
                                                    ? 'bg-primary-600 text-white rounded-tr-none shadow-primary-600/20'
                                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'}`}>
                                                    <p className="text-sm">{msg.message}</p>
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={scrollRef} />
                            </div>

                            <div className="p-4 bg-white border-t border-slate-200">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg shadow-primary-600/20"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <MessageSquare size={32} className="text-primary-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Select a Conversation</h3>
                            <p className="max-w-xs text-sm">Select your trainer to start chatting and tracking your progress.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
