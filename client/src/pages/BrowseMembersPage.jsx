import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { MemberCard } from '../components/MemberCard';
import { ProfileModal } from '../components/ProfileModal';
import { PUNE_AREAS, NAVRATRI_DAYS, EXPERIENCE_LEVELS, ACTIVITIES, LOOKING_FOR_OPTIONS, GENDERS } from '../utils/constants';
import { Filter, Sparkles, RefreshCw, Calendar, Info, LogIn, UserPlus } from 'lucide-react';
import { apiUrl } from '../utils/api';

export const BrowseMembersPage = ({ setActiveTab }) => {
  const { currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedLookingFor, setSelectedLookingFor] = useState('All');

  // Modals & Toast
  const [viewingMember, setViewingMember] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedArea !== 'All') params.append('area', selectedArea);
      if (selectedGender !== 'All') params.append('gender', selectedGender);
      if (selectedExperience !== 'All') params.append('experience', selectedExperience);
      if (selectedActivity !== 'All') params.append('activity', selectedActivity);
      if (selectedDay !== 'All') params.append('day', selectedDay);
      if (selectedLookingFor !== 'All') params.append('lookingFor', selectedLookingFor);
      if (currentUser?.id) params.append('currentUserId', currentUser.id);

      const res = await fetch(apiUrl(`/api/users?${params.toString()}`));
      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [selectedArea, selectedGender, selectedExperience, selectedActivity, selectedDay, selectedLookingFor, currentUser]);

  const handleRequestSuccess = (partnerId, day, message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 5000);
    fetchMembers();
  };

  const handleRequireLogin = () => {
    setActiveTab('login');
    window.scrollTo(0, 0);
  };

  const resetFilters = () => {
    setSelectedArea('All');
    setSelectedGender('All');
    setSelectedExperience('All');
    setSelectedActivity('All');
    setSelectedDay('All');
    setSelectedLookingFor('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="text-2xl">🎉</span>
          <div className="text-xs font-bold">{toastMessage}</div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-purple-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Pune Garba Directory
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Find Your GarbaSaathi 💃
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/70 mt-1">
            Browse members, filter by day & locality, and send connection requests for Navratri!
          </p>
        </div>

        {/* User Login status */}
        {currentUser ? (
          <div className="bg-purple-950/70 border border-purple-800/60 p-3 rounded-2xl flex items-center gap-3 shrink-0">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border border-pink-400" />
            <div className="text-xs">
              <p className="text-[10px] text-pink-300 font-semibold">Logged in as:</p>
              <p className="font-extrabold text-white">{currentUser.name} ({currentUser.area})</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('login'); window.scrollTo(0,0); }}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <LogIn className="w-4 h-4" /> Login to Connect
            </button>
          </div>
        )}
      </div>

      {/* Day Selector Pills */}
      <div className="bg-[#190a30] border border-purple-800/50 p-4 rounded-3xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-pink-400" /> Select Navratri Day:
          </span>
          {selectedDay !== 'All' && (
            <span className="text-[11px] text-pink-300 font-medium">
              Showing members available for <strong className="text-amber-300">Day {selectedDay}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedDay('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
              selectedDay === 'All'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
                : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/50'
            }`}
          >
            All 9 Days
          </button>

          {NAVRATRI_DAYS.map((d) => {
            const isSelected = selectedDay === d.day.toString();
            return (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day.toString())}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white border-pink-400 shadow-lg shadow-pink-600/30'
                    : 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-900/50'
                }`}
              >
                <span>Day {d.day}</span>
                <span className="text-[10px] opacity-75 font-normal">({d.name})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#180930]/80 border border-purple-800/40 p-4 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
            <Filter className="w-4 h-4 text-pink-400" /> Filter Members
          </div>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <div>
            <label className="block text-[10px] font-bold text-purple-300/80 uppercase mb-1">Pune Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-purple-950/90 border border-purple-700/50 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-pink-500"
            >
              <option value="All">All Pune Areas</option>
              {PUNE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-purple-300/80 uppercase mb-1">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-purple-950/90 border border-purple-700/50 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-pink-500"
            >
              <option value="All">All Genders</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-purple-300/80 uppercase mb-1">Experience</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-purple-950/90 border border-purple-700/50 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-pink-500"
            >
              <option value="All">All Levels</option>
              {EXPERIENCE_LEVELS.map(exp => <option key={exp} value={exp}>{exp}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-purple-300/80 uppercase mb-1">Activity</label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full bg-purple-950/90 border border-purple-700/50 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-pink-500"
            >
              <option value="All">Garba & Dandiya</option>
              {ACTIVITIES.map(act => <option key={act} value={act}>{act}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-purple-300/80 uppercase mb-1">Looking For</label>
            <select
              value={selectedLookingFor}
              onChange={(e) => setSelectedLookingFor(e.target.value)}
              className="w-full bg-purple-950/90 border border-purple-700/50 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-pink-500"
            >
              <option value="All">Anyone / All</option>
              {LOOKING_FOR_OPTIONS.map(lf => <option key={lf} value={lf}>{lf}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Data Privacy Notice */}
      <div className="bg-purple-950/50 border border-purple-800/40 rounded-2xl p-3 text-xs text-purple-200/80 flex items-center gap-2">
        <Info className="w-4 h-4 text-pink-400 shrink-0" />
        <span>
          <strong>Data Privacy & Connection Acceptance:</strong> Click "Send Request" to request a connection. Social handles remain protected until the recipient accepts your request in their Dashboard.
        </span>
      </div>

      {/* Grid of Member Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-purple-300">Finding GarbaSaathis in Pune...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#180930]/60 border border-purple-800/40 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto text-4xl">
            💃
          </div>
          <h3 className="text-xl font-bold text-white">No GarbaSaathi found in this area yet</h3>
          <p className="text-xs text-purple-200/70 max-w-md mx-auto">
            Be the pioneer! Create your account or adjust your filters to discover members in other Pune locations.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => { setActiveTab('register'); window.scrollTo(0,0); }}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-pink-600/30 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Be the first to join!
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-3 bg-purple-900/50 text-purple-200 text-xs font-bold rounded-xl transition"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              currentUser={currentUser}
              selectedDay={selectedDay}
              onRequestSuccess={handleRequestSuccess}
              onViewProfile={(m) => setViewingMember(m)}
              onRequireLogin={handleRequireLogin}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {viewingMember && (
        <ProfileModal
          member={viewingMember}
          currentUser={currentUser}
          selectedDay={selectedDay}
          onClose={() => setViewingMember(null)}
          onRequestSuccess={handleRequestSuccess}
          onRequireLogin={handleRequireLogin}
        />
      )}

    </div>
  );
};
