import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { PUNE_AREAS, NAVRATRI_DAYS, EXPERIENCE_LEVELS, ACTIVITIES, LOOKING_FOR_OPTIONS, GENDERS } from '../utils/constants';
import { Sparkles, User, MapPin, Calendar, Heart, ShieldCheck, AtSign, Image, ArrowRight, Lock, Mail } from 'lucide-react';

export const RegisterPage = ({ setActiveTab }) => {
  const { registerUser } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    age: '22',
    gender: 'Female',
    area: 'Wakad',
    experience: 'Intermediate',
    activity: 'Both',
    availableDays: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lookingFor: 'Garba Friends',
    socialContact: '',
    bio: ''
  });

  const handleDayToggle = (dayNum) => {
    setFormData(prev => {
      const current = prev.availableDays;
      if (current.includes(dayNum)) {
        if (current.length === 1) return prev;
        return { ...prev, availableDays: current.filter(d => d !== dayNum) };
      } else {
        return { ...prev, availableDays: [...current, dayNum].sort((a, b) => a - b) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) return setErrorMsg('Please enter your full name.');
    if (!formData.email.trim() || !formData.email.includes('@')) return setErrorMsg('Please enter a valid email.');
    if (!formData.password.trim() || formData.password.length < 4) return setErrorMsg('Password must be at least 4 characters.');
    if (!formData.socialContact.trim()) return setErrorMsg('Please enter your Instagram handle.');
    if (!formData.bio.trim()) return setErrorMsg('Please tell us a little about yourself.');

    setSubmitting(true);
    const res = await registerUser(formData);
    setSubmitting(false);

    if (res.success) {
      setActiveTab('dashboard');
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.error || 'Failed to create profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3.5 py-1 rounded-full border border-pink-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Join Pune Community
        </div>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Join GarbaSaathi 💃🕺
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/70 max-w-lg mx-auto">
          Create your account in 1 minute and connect with Garba lovers across Pune.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#180930]/90 border border-purple-800/50 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        
        {/* Section 1: Account Credentials */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <Lock className="w-4 h-4 text-pink-400" /> 1. Account Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. ananya@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="At least 4 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal Profile */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <User className="w-4 h-4 text-pink-400" /> 2. Basic Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya Patil"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Age *</label>
              <input
                type="number"
                min="16"
                max="99"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1.5">Gender *</label>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    formData.gender === g
                      ? 'bg-pink-600 text-white border-pink-400 shadow-md'
                      : 'bg-purple-950/60 text-purple-300 border-purple-800/60 hover:bg-purple-900/40'
                  }`}
                >
                  {g === 'Female' ? '💃 Female' : g === 'Male' ? '🕺 Male' : '✨ Other'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Pune Area */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <MapPin className="w-4 h-4 text-rose-400" /> 3. Pune Location
          </h3>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">Area in Pune *</label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
            >
              {PUNE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Section 4: Garba Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <Calendar className="w-4 h-4 text-amber-400" /> 4. Garba Experience & Days
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Garba Experience *</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {EXPERIENCE_LEVELS.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Preferred Activity *</label>
              <select
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {ACTIVITIES.map(act => <option key={act} value={act}>{act}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1.5">
              Preferred Garba Dates (Select Multiple Days) *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
              {NAVRATRI_DAYS.map((d) => {
                const isSelected = formData.availableDays.includes(d.day);
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => handleDayToggle(d.day)}
                    className={`py-2 text-center rounded-xl text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-gradient-to-tr from-pink-600 to-rose-600 text-white border-pink-400 shadow-md'
                        : 'bg-purple-950/60 text-purple-400 border-purple-800/40 hover:text-white'
                    }`}
                  >
                    Day {d.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Looking For */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <Heart className="w-4 h-4 text-pink-400" /> 5. Looking For
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LOOKING_FOR_OPTIONS.map((lf) => (
              <button
                key={lf}
                type="button"
                onClick={() => setFormData({ ...formData, lookingFor: lf })}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  formData.lookingFor === lf
                    ? 'bg-pink-600 text-white border-pink-400 shadow-md'
                    : 'bg-purple-950/60 text-purple-300 border-purple-800/60 hover:bg-purple-900/40'
                }`}
              >
                {lf}
              </button>
            ))}
          </div>
        </div>

        {/* Section 6: Social Handle */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            <AtSign className="w-4 h-4 text-pink-400" /> 6. Preferred Public Contact
          </h3>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">
              Instagram Username or Social Contact *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Instagram: @ananya_garba_pune"
              value={formData.socialContact}
              onChange={(e) => setFormData({ ...formData, socialContact: e.target.value })}
              className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
            />
            <p className="text-[11px] text-purple-300/70 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Mobile numbers are kept private. Your social handle is ONLY revealed when a connection request is accepted!</span>
            </p>
          </div>
        </div>

        {/* Section 7: About You */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-purple-800/50">
            ✨ 7. About You
          </h3>

          <div>
            <label className="block text-xs font-bold text-purple-200 mb-1">Tell us a little about yourself *</label>
            <textarea
              rows={3}
              required
              placeholder="Tell us a little about yourself and what kind of Garba experience you're looking for..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white rounded-2xl font-extrabold text-base transition shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{submitting ? 'Registering...' : 'Complete Registration & Open Dashboard'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>

    </div>
  );
};
