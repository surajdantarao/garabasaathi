import React, { useState } from 'react';
import { X, MapPin, Calendar, Sparkles, CheckCircle2, ShieldCheck, AtSign, Clock, Lock } from 'lucide-react';
import { NAVRATRI_DAYS } from '../utils/constants';
import { apiUrl } from '../utils/api';

export const ProfileModal = ({ member, currentUser, selectedDay, onClose, onRequestSuccess, onRequireLogin }) => {
  if (!member) return null;

  const [requesting, setRequesting] = useState(false);
  const [targetDay, setTargetDay] = useState(
    selectedDay && selectedDay !== 'All' 
      ? parseInt(selectedDay, 10) 
      : (member.availableDays[0] || 1)
  );
  const [requestStatus, setRequestStatus] = useState(member.connectionStatus || null);

  const handleSendRequest = async () => {
    if (!currentUser) {
      onClose();
      if (onRequireLogin) onRequireLogin();
      return;
    }

    try {
      setRequesting(true);
      const res = await fetch(apiUrl('/api/connections/request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: member.id,
          navratriDay: targetDay
        })
      });

      const data = await res.json();
      if (data.success) {
        setRequestStatus('pending');
        if (onRequestSuccess) {
          onRequestSuccess(member.id, targetDay, data.message);
        }
      } else {
        alert(data.error || 'Failed to send request');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending connection request');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#180930] border border-purple-700/60 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="relative h-44 bg-gradient-to-r from-pink-900/60 via-purple-900/80 to-indigo-900/60 p-6 flex items-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 border border-purple-500/40 text-purple-200 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 relative top-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center border-4 border-[#180930] shadow-xl text-3xl shrink-0">
              {member.gender === 'Female' ? '💃' : member.gender === 'Male' ? '🕺' : '✨'}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                {member.name}, {member.age}
              </h2>
              <p className="text-xs text-pink-300 font-semibold flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {member.area}, Pune
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 pt-10 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-purple-950/70 border border-purple-800/50 p-2.5 rounded-2xl">
              <p className="text-[10px] text-purple-300/70 font-semibold uppercase">Experience</p>
              <p className="text-xs font-bold text-amber-300 mt-0.5">⭐ {member.experience}</p>
            </div>
            <div className="bg-purple-950/70 border border-purple-800/50 p-2.5 rounded-2xl">
              <p className="text-[10px] text-purple-300/70 font-semibold uppercase">Activity</p>
              <p className="text-xs font-bold text-pink-300 mt-0.5">💃 {member.activity}</p>
            </div>
            <div className="bg-purple-950/70 border border-purple-800/50 p-2.5 rounded-2xl">
              <p className="text-[10px] text-purple-300/70 font-semibold uppercase">Looking For</p>
              <p className="text-xs font-bold text-emerald-300 mt-0.5">{member.lookingFor}</p>
            </div>
          </div>

          {/* About Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">About {member.name.split(' ')[0]}</h4>
            <p className="text-xs text-purple-100/90 leading-relaxed bg-purple-950/50 p-3.5 rounded-2xl border border-purple-800/40">
              "{member.bio}"
            </p>
          </div>

          {/* Available Days */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-pink-400" /> Available Days in Navratri
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(member.availableDays) && member.availableDays.map(d => (
                <button
                  key={d}
                  onClick={() => setTargetDay(d)}
                  className={`text-xs font-bold px-3 py-1 rounded-xl border transition ${
                    targetDay === d
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
                      : 'bg-purple-950/70 text-purple-300 border-purple-800/60 hover:border-purple-600'
                  }`}
                >
                  Day {d}
                </button>
              ))}
            </div>
          </div>

          {/* Protected Social Contact */}
          <div className="bg-gradient-to-r from-pink-950/40 to-purple-950/40 p-4 rounded-2xl border border-pink-800/30">
            <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AtSign className="w-4 h-4 text-pink-400" /> Public Social Contact
            </h4>
            
            <p className="text-sm font-extrabold text-white mt-1">
              {member.socialContact}
            </p>

            <p className="text-[11px] text-purple-300/70 mt-2 flex items-start gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>For user safety, social handle details are ONLY revealed when a connection request is ACCEPTED by both partners!</span>
            </p>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-[#140628] border-t border-purple-900/50 flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-purple-300/80 uppercase mb-1">
              Select Navratri Day:
            </label>
            <select
              value={targetDay}
              onChange={(e) => setTargetDay(parseInt(e.target.value, 10))}
              className="w-full bg-purple-950 border border-purple-700/60 text-white text-xs font-bold rounded-xl px-2.5 py-2 focus:outline-none focus:border-pink-500"
            >
              {Array.isArray(member.availableDays) && member.availableDays.map(d => (
                <option key={d} value={d}>Day {d} (Navratri)</option>
              ))}
            </select>
          </div>

          {requestStatus === 'accepted' ? (
            <div className="flex-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 py-2.5 px-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Connected
            </div>
          ) : requestStatus === 'pending' ? (
            <div className="flex-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 py-2.5 px-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" /> Request Pending
            </div>
          ) : (
            <button
              onClick={handleSendRequest}
              disabled={requesting}
              className="flex-1 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-lg shadow-pink-600/30 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              {requesting ? 'Sending...' : `Send Request for Day ${targetDay}`}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
