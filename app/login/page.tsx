"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isMockEnvironment } from '@/lib/firebase';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isMockEnvironment) {
      setTimeout(() => {
        router.push('/');
      }, 500);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 justify-center">
      <div className="w-full max-w-sm mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-red-500 mb-2 tracking-tight">HerGuard AI</h1>
          <p className="text-gray-400">Sign in to sync your safety network</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-2xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-red-500 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
