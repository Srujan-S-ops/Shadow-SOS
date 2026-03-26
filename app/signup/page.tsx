"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db, isMockEnvironment } from '@/lib/firebase';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
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
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Set Display Name
      await updateProfile(user, { displayName: name });
      
      // 3. Create Realtime Database Profile
      await set(ref(db, `users/${user.uid}`), {
        name: name,
        email: email,
        contacts: [] // Initialize empty contacts array
      });

      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 justify-center">
      <div className="w-full max-w-sm mx-auto space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
          <p className="text-gray-400">Generate your unique safety ID</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-2xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              placeholder="Jane Doe"
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 transition-all"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-red-500 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
