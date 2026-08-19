// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <PieChart className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            chart<span className="text-amber-400">-it</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track expenses cleanly and effortlessly
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};