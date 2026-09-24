import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Users, HeartHandshake, EyeOff } from 'lucide-react';

export const SafetySection = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" /> Safety & Privacy Center
        </div>
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Stay Safe While Celebrating Garba 💃
        </h2>
        <p className="mt-3 text-purple-200/70 text-sm max-w-2xl mx-auto">
          GarbaSaathi is built as a wholesome community platform for Pune Navratri lovers. Please keep these simple safety guidelines in mind when connecting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-[#1a0b2e]/70 border border-purple-800/50 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">1. Meet in Public Venues</h3>
          <p className="text-xs text-purple-200/70 leading-relaxed">
            Always meet your GarbaSaathi at official Garba/Dandiya grounds, lawns, or well-lit event venues in Pune. Avoid meeting in secluded locations.
          </p>
        </div>

        <div className="bg-[#1a0b2e]/70 border border-purple-800/50 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">2. No Phone Numbers Exposed</h3>
          <p className="text-xs text-purple-200/70 leading-relaxed">
            We never publicly display your mobile number. Connect using your preferred public handle (like Instagram) only when you feel comfortable.
          </p>
        </div>

        <div className="bg-[#1a0b2e]/70 border border-purple-800/50 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">3. Never Share Financial Info</h3>
          <p className="text-xs text-purple-200/70 leading-relaxed">
            Never send money, OTPs, or financial transfer requests to anyone on the platform. GarbaSaathi is 100% free to use.
          </p>
        </div>

        <div className="bg-[#1a0b2e]/70 border border-purple-800/50 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">4. Respect Boundaries</h3>
          <p className="text-xs text-purple-200/70 leading-relaxed">
            GarbaSaathi is a social community for finding Garba dancing partners and group circles. Maintain respect and zero tolerance for harassment.
          </p>
        </div>

        <div className="bg-[#1a0b2e]/70 border border-purple-800/50 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">5. Report Inappropriate Behavior</h3>
          <p className="text-xs text-purple-200/70 leading-relaxed">
            If any user behaves inappropriately or breaks community standards, use the report button or notify platform moderators immediately.
          </p>
        </div>

        <div className="bg-[#1a0b2e]/70 border border-purple-800/50 rounded-2xl p-5 hover:border-emerald-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">6. Platform Disclaimer</h3>
          <p className="text-xs text-purple-200/70 leading-relaxed">
            GarbaSaathi is an open community board and does not perform background checks. Exercise standard personal caution when interacting.
          </p>
        </div>

      </div>

      <div className="mt-8 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center">
        <p className="text-sm font-semibold text-emerald-200">
          Have fun, dance wholehearted Garba, dress in festive colors, and make lifelong Garba friends in Pune! 🎉
        </p>
      </div>
    </div>
  );
};
