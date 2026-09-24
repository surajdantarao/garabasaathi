import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, Eye, CheckCircle2, Clock, Lock } from 'lucide-react';
import { NAVRATRI_DAYS } from '../utils/constants';
import { apiUrl } from '../utils/api';

export const MemberCard = ({ member, currentUser, selectedDay, onRequestSuccess, onViewProfile, onRequireLogin }) => {
  const [requesting, setRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(member.connectionStatus || null);

  const handleSendRequest = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onRequireLogin) onRequireLogin();
      return;
    }

    const dayToConnect = (selectedDay && selectedDay !== 'All' ? parseInt(selectedDay, 10) : member.availableDays[0]) || 1;

    try {
      setRequesting(true);
      const res = await fetch(apiUrl('/api/connections/request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: member.id,
          navratriDay: dayToConnect
        })
      });

      const data = await res.json();
      if (data.success) {
        setRequestStatus('pending');
        if (onRequestSuccess) {
          onRequestSuccess(member.id, dayToConnect, data.message);
        }
      } else {
        alert(data.error || 'Failed to send request');
      }
    } catch (err) {
      console.error(err);
      alert('Network error sending request');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div 
      onClick={() => onViewProfile(member)}
      className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-purple-800/40 flex flex-col justify-between cursor-pointer relative group overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all" />

      <div>
        {/* Header Avatar & Name */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-pink-600/30 via-purple-700/40 to-amber-500/20 border border-pink-500/40 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <span className="text-xl sm:text-2xl">
              {member.gender === 'Female' ? '💃' : member.gender === 'Male' ? '🕺' : '✨'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-base sm:text-lg font-bold text-white truncate group-hover:text-pink-300 transition">
                {member.name}, {member.age}
              </h3>
              <span className="text-[10px] sm:text-[11px] font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/30 px-2 sm:px-2.5 py-0.5 rounded-full shrink-0">
                {member.lookingFor}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-purple-200/80 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate font-medium">{member.area}, Pune</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 mt-2 text-xs flex-wrap">
              <span className="px-2 py-0.5 rounded-lg bg-purple-900/60 text-purple-200 text-[10px] sm:text-[11px] font-medium border border-purple-700/40">
                ⭐ {member.experience}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-pink-900/40 text-pink-200 text-[10px] sm:text-[11px] font-medium border border-pink-700/40">
                💃 {member.activity}
              </span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-purple-200/80 line-clamp-2 leading-relaxed mb-3 sm:mb-4 bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/40 italic">
          "{member.bio}"
        </p>

        {/* Available Navratri Days Pills */}
        <div className="mb-3 sm:mb-4">
          <p className="text-[10px] sm:text-[11px] font-bold text-purple-300/70 mb-1.5 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-pink-400" /> Available Days:
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(member.availableDays) && member.availableDays.map(d => {
              const isSelectedDayMatch = selectedDay && parseInt(selectedDay, 10) === d;
              return (
                <span 
                  key={d}
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border transition ${
                    isSelectedDayMatch
                      ? 'bg-pink-600 text-white border-pink-400 shadow-sm'
                      : 'bg-purple-950/70 text-purple-300 border-purple-800/60'
                  }`}
                >
                  Day {d}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-purple-900/40 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onViewProfile(member); }}
          className="px-2.5 sm:px-3 py-2.5 sm:py-2 bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shrink-0"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>

        {requestStatus === 'accepted' ? (
          <div className="flex-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 py-2.5 sm:py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Connected
          </div>
        ) : requestStatus === 'pending' ? (
          <div className="flex-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 py-2.5 sm:py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" /> Request Sent
          </div>
        ) : (
          <button
            onClick={handleSendRequest}
            disabled={requesting}
            className="flex-1 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white py-2.5 sm:py-2 rounded-xl text-xs font-bold transition shadow-md shadow-pink-600/20 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            {requesting ? (
              'Sending...'
            ) : (
              <>
                <span className="hidden sm:inline">
                  {selectedDay && selectedDay !== 'All' 
                    ? `Send Request for Day ${selectedDay}`
                    : `Send Request for Day ${member.availableDays[0] || 1}`
                  }
                </span>
                <span className="sm:hidden">
                  {selectedDay && selectedDay !== 'All' 
                    ? `Request Day ${selectedDay}`
                    : `Request Day ${member.availableDays[0] || 1}`
                  }
                </span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
};
