// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({ username, email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* Username Field */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-slate-900 font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-yellow-400/20 mt-2 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Switch Link */}
      {onSwitchToLogin && (
        <p className="text-center text-xs text-slate-500 mt-3">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-600 font-bold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      )}
    </form>
  );
};