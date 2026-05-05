'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', formData);
      const { user, tokens } = response.data;
      setAuth(user, tokens.jwtToken, tokens.streamToken);
      router.push('/dashboard/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-50 to-blue-100 px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-5 border border-white/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mt-2 font-medium">Sign in to continue to your workspace</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-2xl">
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 animate-ping"></div>
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 glass-input rounded-2xl text-slate-900 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3.5 glass-input rounded-2xl text-slate-900 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-primary-200 hover:shadow-primary-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 mt-2 text-sm tracking-wide uppercase"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm font-medium mt-7">
            New here?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-black transition-colors">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}