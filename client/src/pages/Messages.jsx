import { useState, useEffect, useRef } from 'react';
import { getMessages, createMessage } from '../services/api';
import {
  Search, Send, Phone, Info, CheckCheck, Clock,
  Sparkles, MessageSquare, Plus, Bell, User, MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_CONVERSATIONS = [
  { id: 'conv-alice', name: 'Alice Johnson', room: 'Suite 301', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', lastTime: '10:15 AM', status: 'Checked-in' },
  { id: 'conv-michael', name: 'Michael Brown', room: 'Deluxe 201', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', lastTime: '09:42 AM', status: 'Checked-in' },
  { id: 'conv-emily', name: 'Emily Davis', room: 'Room 102', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', lastTime: 'Yesterday', status: 'Checked-in' },
  { id: 'conv-john', name: 'John Doe', room: 'Suite 302', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', lastTime: 'Oct 05', status: 'Confirmed' },
  { id: 'conv-jane', name: 'Jane Smith', room: 'Family 501', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', lastTime: 'Oct 04', status: 'Checked-in' },
];

const QUICK_RESPONSES = [
  'Housekeeping is on the way!',
  'Your room service order has been received.',
  'Late check-out confirmed until 1:00 PM.',
  'Concierge will bring your luggage shortly.',
  'Pool is open until 10:00 PM tonight.',
];

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(DEFAULT_CONVERSATIONS[0]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (activeConv?.id) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoadingConv(true);
    try {
      const res = await getMessages();
      if (res.data && res.data.length > 0) {
        // Merge with preset metadata
        const merged = res.data.map((c) => {
          const meta = DEFAULT_CONVERSATIONS.find((d) => d.id === c._id) || {};
          return {
            id: c._id,
            name: c.senderName || meta.name || 'Guest',
            avatar: meta.avatar || '',
            room: meta.room || 'Room 204',
            lastMessage: c.lastMessage || 'Hello, I have an inquiry...',
            unread: c.unread || 0,
            lastTime: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: meta.status || 'Active',
          };
        });
        setConversations(merged);
        if (!activeConv || !merged.find((m) => m.id === activeConv.id)) {
          setActiveConv(merged[0]);
        }
      } else {
        // Fallback to default conversations
        setConversations(
          DEFAULT_CONVERSATIONS.map((c, i) => ({
            ...c,
            lastMessage: i === 0 ? 'Hi, I would like to request a late check-out...' : 'Thank you for your assistance!',
            unread: i === 0 ? 2 : 0,
          }))
        );
      }
    } catch {
      setConversations(
        DEFAULT_CONVERSATIONS.map((c, i) => ({
          ...c,
          lastMessage: i === 0 ? 'Hi, I would like to request a late check-out...' : 'Thank you for your assistance!',
          unread: i === 0 ? 1 : 0,
        }))
      );
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessages = async (convId) => {
    setLoadingMsgs(true);
    try {
      const res = await getMessages({ conversationId: convId });
      if (res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        // Fallback default message thread
        setMessages([
          {
            _id: '1',
            senderName: activeConv.name,
            message: "Hello front desk! I'd love to enquire about hotel amenities.",
            isFromGuest: true,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            _id: '2',
            senderName: 'Oasis Front Desk',
            message: "Welcome to Oasis Hotel & Spa! Our spa, gym, and rooftop pool are open from 7 AM to 10 PM daily.",
            isFromGuest: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      }
    } catch {
      setMessages([
        {
          _id: '1',
          senderName: activeConv.name,
          message: "Hi, could we get fresh towels for our room?",
          isFromGuest: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConv) return;

    setSending(true);
    const tempMsg = {
      _id: Date.now().toString(),
      senderName: 'Oasis Front Desk',
      receiverName: activeConv.name,
      message: text,
      isFromGuest: false,
      conversationId: activeConv.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');

    try {
      await createMessage({
        senderName: 'Oasis Front Desk',
        receiverName: activeConv.name,
        message: text,
        isFromGuest: false,
        conversationId: activeConv.id,
      });
      // Mark local unread as cleared
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConv.id ? { ...c, unread: 0, lastMessage: text } : c))
      );
    } catch {
      toast.error('Message failed to sync with server');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.room && c.room.toLowerCase().includes(search.toLowerCase())) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Guest Messages</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Direct real-time concierge communication with hotel guests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Concierge Active
          </span>
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[calc(100vh-180px)]">
        {/* Left Panel: Conversation List */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-gray-100 flex flex-col bg-gray-50/40">
          {/* Search Box */}
          <div className="p-3.5 border-b border-gray-100 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guest or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {loadingConv ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-400 text-xs">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isActive
                        ? 'bg-blue-50/70 border-l-4 border-primary'
                        : 'hover:bg-gray-50 bg-white'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.avatar ? (
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-11 h-11 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#4169D8] to-indigo-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {conv.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{conv.name}</p>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{conv.lastTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                          {conv.room}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate leading-relaxed">
                        {conv.lastMessage || 'Tap to chat with guest'}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Active Chat Thread */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-white">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 px-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeConv.avatar ? (
                      <img
                        src={activeConv.avatar}
                        alt={activeConv.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                        {activeConv.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{activeConv.name}</h3>
                    <p className="text-[11px] text-gray-400">
                      {activeConv.room || 'Deluxe Room'} • <span className="text-emerald-600 font-medium">In-House Guest</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.success(`Calling ${activeConv.name} at extension...`)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors"
                    title="Call Room Extension"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toast(`Guest ${activeConv.name} is checked into ${activeConv.room}`, { icon: 'ℹ️' })}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors"
                    title="Guest Info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-gray-200/60 text-gray-500 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {loadingMsgs ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  </div>
                ) : (
                  messages.map((m) => {
                    const isStaff = !m.isFromGuest;
                    return (
                      <div
                        key={m._id || m.createdAt}
                        className={`flex gap-2.5 ${isStaff ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isStaff && (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0 mt-1">
                            {activeConv.name.charAt(0)}
                          </div>
                        )}

                        <div className={`max-w-[75%] sm:max-w-[65%]`}>
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                              isStaff
                                ? 'bg-[#4169D8] text-white rounded-br-xs'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{m.message}</p>
                          </div>
                          <div
                            className={`flex items-center gap-1 text-[10px] text-gray-400 mt-1 px-1 ${
                              isStaff ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <span>
                              {m.createdAt
                                ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'Just now'}
                            </span>
                            {isStaff && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                        </div>

                        {isStaff && (
                          <div className="w-7 h-7 rounded-full bg-[#4169D8] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-1">
                            O
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Response Suggestions */}
              <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex-shrink-0 mr-1">
                  Quick Reply:
                </span>
                {QUICK_RESPONSES.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-primary rounded-lg text-[11px] whitespace-nowrap border border-gray-200 hover:border-blue-200 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Reply to ${activeConv.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    inputText.trim()
                      ? 'bg-[#4169D8] text-white hover:bg-blue-600 shadow-sm shadow-[#4169D8]/25'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-600">Select a conversation</p>
              <p className="text-xs text-gray-400 mt-1">Choose a guest on the left to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
