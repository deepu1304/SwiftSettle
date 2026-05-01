import React from 'react';
import { ShieldCheck, Mail, Lock, KeyRound } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* 1. Gradient Background Decoration (The "Colorful") */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        {/* Soft, vibrant blurry circles for that modern SaaS background look */}
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-swiftIndigo/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-swiftPink/20 rounded-full blur-[120px]" />
      </div>

      {/* 2. Glassmorphism Login Container (The "Elegant/Classy") */}
      <div className="w-full max-w-[500px] bg-white/70 backdrop-blur-2xl p-12 rounded-[32px] border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-swiftIndigo p-3.5 rounded-3xl mb-5 shadow-lg shadow-swiftIndigo/20">
            <ShieldCheck className="text-white w-9 h-9" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">
            Swift<span className="text-swiftIndigo">Settle</span>
          </h1>
          <p className="text-slate-600 mt-2.5 font-medium">Enterprise Financial Management</p>
        </div>

        {/* Input Form with Advanced Features */}
        <form className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-swiftIndigo transition-colors" />
            <input 
              type="email" 
              placeholder="Work Email" 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white/60 focus:bg-white focus:border-swiftIndigo focus:ring-4 focus:ring-swiftIndigo/15 transition-all outline-none" 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-swiftPink transition-colors" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white/60 focus:bg-white focus:border-swiftPink focus:ring-4 focus:ring-swiftPink/15 transition-all outline-none" 
            />
          </div>

          {/* Attractive, Colorful Call to Action Button */}
          <button 
            type="submit" 
            className="w-full bg-slate-950 hover:bg-black text-white py-4.5 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-slate-300"
          >
            Sign In to Dashboard <KeyRound size={20} className="opacity-80" />
          </button>
        </form>

        {/* Support Link */}
        <div className="mt-10 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 font-medium">
            Don't have an account? <span className="text-swiftIndigo font-bold cursor-pointer hover:underline">Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;