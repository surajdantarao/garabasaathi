import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, MessageSquare, ShieldCheck, MapPin, Calendar, AtSign, ArrowRightLeft, Clock } from 'lucide-react';
import { apiUrl } from '../utils/api';

export const AdminChatModal = ({ connectionId, initialConnection, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(initialConnection || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChatLog = async (isSilent = false) => {
    if (!connectionId) return;
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const res = await fetch(apiUrl(`/api/admin/chat/${connectionId}`));
      const data = await res.json();

      if (data.success) {
        setMessages(data.messages || []);
        if (data.connection) {
          setConnection(data.connection);
        }
      }
    } catch (err) {
      console.error('Error fetching admin chat log:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChatLog();
    // Auto refresh every 5 seconds while modal is open
    const interval = setInterval(() => {
      fetchChatLog(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [connectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const senderName = connection?.senderName || 'Sender';
  const senderUsername = connection?.senderUsername || '';
  const senderArea = connection?.senderArea || '';
  const senderContact = connection?.senderContact || '';
  const senderGender = connection?.senderGender || 'Female';
  const senderId = connection?.senderId;

  const receiverName = connection?.receiverName || 'Receiver';
  const receiverUsername = connection?.receiverUsername || '';
  const receiverArea = connection?.receiverArea || '';
  const receiverContact = connection?.receiverContact || '';
  const receiverGender = connection?.receiverGender || 'Male';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#140624] border border-purple-700/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-[94vh] sm:h-[85vh] max-h-[800px] flex flex-col"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-[#1d0935] to-[#280c49] border-b border-purple-800/60 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Admin Chat Monitor
              </span>
              <span className="text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2.5 py-0.5 rounded-full">
                Day {connection?.navratriDay || 1} Match
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchChatLog(true)}
                disabled={refreshing}
                className="p-2 bg-purple-900/60 hover:bg-purple-800/70 text-purple-300 rounded-xl border border-purple-700/50 transition active:scale-95"
                title="Refresh Chat Stream"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-pink-400' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-purple-900/60 hover:bg-purple-800/70 text-purple-300 hover:text-white rounded-xl border border-purple-700/50 transition active:scale-95"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connected Participants Comparison Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 p-3 bg-purple-950/70 border border-purple-800/60 rounded-2xl">
            
            {/* Sender */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-base shadow border border-pink-400 shrink-0">
                {senderGender === 'Female' ? '💃' : senderGender === 'Male' ? '🕺' : '✨'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate flex items-center gap-1.5">
                  <span>{senderName}</span>
                  <span className="text-[10px] text-pink-400 font-mono">@{senderUsername}</span>
                </p>
                <p className="text-[10px] text-purple-300 truncate flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-rose-400" /> {senderArea} • <span className="text-emerald-300 font-mono">{senderContact}</span>
                </p>
              </div>
            </div>

            {/* Receiver */}
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-purple-800/60 pt-2 sm:pt-0 sm:pl-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-base shadow border border-purple-400 shrink-0">
                {receiverGender === 'Female' ? '💃' : receiverGender === 'Male' ? '🕺' : '✨'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate flex items-center gap-1.5">
                  <span>{receiverName}</span>
                  <span className="text-[10px] text-purple-300 font-mono">@{receiverUsername}</span>
                </p>
                <p className="text-[10px] text-purple-300 truncate flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-rose-400" /> {receiverArea} • <span className="text-emerald-300 font-mono">{receiverContact}</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#140624] via-[#10041e] to-[#0c0316]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <RefreshCw className="w-7 h-7 text-pink-400 animate-spin" />
              <p className="text-xs text-purple-300">Loading conversation history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/40 text-purple-400 flex items-center justify-center border border-purple-700/40">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">No Messages Exchanged Yet</p>
              <p className="text-xs text-purple-300/70 max-w-sm">
                These Saathis accepted each other's connection request for Day {connection?.navratriDay}, but haven't started chatting yet.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isSender = m.senderId === senderId;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isSender ? 'items-start' : 'items-end'}`}
                >
                  {/* Sender identity badge */}
                  <div className={`flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold ${
                    isSender ? 'text-pink-400' : 'text-purple-300'
                  }`}>
                    <span>{m.senderName}</span>
                    <span className="text-[10px] text-purple-400 font-mono">(@{m.senderUsername})</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-md border ${
                      isSender
                        ? 'bg-gradient-to-r from-pink-900/60 to-rose-950/80 text-pink-50 border-pink-700/50 rounded-tl-sm'
                        : 'bg-gradient-to-r from-purple-900/70 to-indigo-950/80 text-purple-50 border-purple-700/50 rounded-tr-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-[13px]">
                      {m.text}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-purple-300/70 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatTime(m.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-purple-950/90 border-t border-purple-800/60 flex items-center justify-between text-xs text-purple-300 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-medium text-purple-200">
              Read-Only Safe Mode • Total <strong className="text-white">{messages.length}</strong> messages recorded
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition active:scale-95"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
