import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MapPin, Calendar, ShieldCheck, Sparkles, Clock, Check, CheckCheck } from 'lucide-react';
import { apiUrl } from '../utils/api';

export const ChatModal = ({ connectionId, partner, day, currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activePartner, setActivePartner] = useState(partner || null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const fetchChat = async (isInitial = false) => {
    if (!connectionId) return;
    try {
      if (isInitial) setLoading(true);
      const res = await fetch(apiUrl(`/api/chat/${connectionId}?userId=${currentUser?.id || ''}`));
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        if (data.connection?.partner) {
          setActivePartner(data.connection.partner);
        }
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat(true);
    // Poll every 3 seconds for real-time conversation updates
    const timer = setInterval(() => {
      fetchChat(false);
    }, 3000);

    return () => clearInterval(timer);
  }, [connectionId]);

  useEffect(() => {
    scrollToBottom(loading ? 'auto' : 'smooth');
  }, [messages, loading]);

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || newMessage).trim();
    if (!text || sending || !connectionId || !currentUser?.id) return;

    // Optimistic UI update
    const tempId = 'temp_' + Date.now();
    const optimisticMsg = {
      id: tempId,
      connectionId,
      senderId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
      senderName: currentUser.name,
      senderGender: currentUser.gender
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');
    setSending(true);

    try {
      const res = await fetch(apiUrl(`/api/chat/${connectionId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          text
        })
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
      } else {
        // Rollback on failure
        setMessages(prev => prev.filter(m => m.id !== tempId));
        alert(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert('Network error sending message');
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMsgTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const partnerDisplayName = activePartner?.name || partner?.name || 'Saathi';
  const partnerAge = activePartner?.age || partner?.age || '';
  const partnerArea = activePartner?.area || partner?.area || 'Pune';
  const partnerGender = activePartner?.gender || partner?.gender || 'Female';
  const targetDay = day || activePartner?.connectedDay || 1;

  const quickReplies = [
    `💃 Excited for Day ${targetDay} Garba!`,
    `🥁 Reaching venue by 8:00 PM!`,
    `✨ What color outfit are you wearing?`,
    `📍 Let's meet at the main gate`
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#150727] border border-purple-700/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-[94vh] sm:h-[85vh] max-h-[750px] flex flex-col"
      >
        {/* Chat Header */}
        <div className="px-4 py-3 sm:py-3.5 bg-gradient-to-r from-purple-950 via-[#1e0a38] to-[#280c49] border-b border-purple-800/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center text-xl shadow-md border border-pink-400 shrink-0">
                {partnerGender === 'Female' ? '💃' : partnerGender === 'Male' ? '🕺' : '✨'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#150727] rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                  {partnerDisplayName} {partnerAge ? `(${partnerAge})` : ''}
                </h3>
                <span className="text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.2 rounded-full shrink-0">
                  Day {targetDay} Saathi
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-purple-200/80 mt-0.5 truncate">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {partnerArea}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-900/60 hover:bg-rose-500/30 border border-purple-600/40 text-purple-200 hover:text-white flex items-center justify-center transition active:scale-95 shrink-0"
            aria-label="Close chat"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-gradient-to-r from-pink-950/40 to-purple-950/40 px-3 py-1.5 border-b border-purple-900/50 flex items-center justify-center gap-1.5 text-[10px] text-purple-300/80 text-center shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Connection Accepted • Chat safely for Navratri Day {targetDay} plans</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#110520]/80">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-purple-300/70">
              <div className="w-7 h-7 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading Garba conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3 max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center text-2xl">
                💬
              </div>
              <h4 className="text-sm font-bold text-white">Start Your Conversation!</h4>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                You both connected for Day {targetDay} Garba. Say hi, discuss your venue passes, timing, and traditional outfit colors!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = currentUser?.id && msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
                >
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-xs font-medium'
                        : 'bg-[#22103a] border border-purple-700/60 text-purple-100 rounded-bl-xs'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold text-pink-300 mb-0.5">
                        {msg.senderName || partnerDisplayName}
                      </p>
                    )}
                    <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                        isMe ? 'text-pink-200/80' : 'text-purple-300/60'
                      }`}
                    >
                      <span>{formatMsgTime(msg.createdAt)}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-pink-200" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-1.5 bg-[#17082c] border-t border-purple-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="text-[10px] sm:text-[11px] font-medium bg-purple-950/80 hover:bg-pink-600/30 text-purple-200 hover:text-white px-2.5 py-1 rounded-full border border-purple-800/60 hover:border-pink-500/50 whitespace-nowrap transition active:scale-95 shrink-0"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-2.5 sm:p-3 bg-[#130524] border-t border-purple-800/60 flex items-center gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${partnerDisplayName.split(' ')[0]}...`}
            className="flex-1 bg-purple-950/80 border border-purple-700/60 text-white placeholder-purple-300/40 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-pink-500 transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-lg shadow-pink-600/30 active:scale-95 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

      </div>
    </div>
  );
};
