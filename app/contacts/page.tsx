"use client";
import React, { useState } from 'react';
import { useAppStore } from '@/lib/Store';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Trash2, Copy, Check } from 'lucide-react';

export default function ContactsPage() {
  const { contacts, addContact, removeContact, userId } = useAppStore();
  const [name, setName] = useState('');
  const [friendId, setFriendId] = useState('');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !friendId) return;
    
    addContact({
      id: friendId.trim(),
      name,
      phone
    });
    setName('');
    setFriendId('');
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Trusted Contacts</h1>
      </header>

      {/* Share ID Section */}
      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl mb-8 flex flex-col justify-center items-center text-center">
        <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Your Unique Safety ID</p>
        <div className="flex items-center justify-center gap-3 bg-black px-4 py-3 rounded-xl border border-neutral-800 w-full mb-3 overflow-hidden">
          <code className="text-red-500 font-mono text-sm sm:text-base font-bold truncate">{userId || "Loading..."}</code>
        </div>
        <button 
          onClick={handleCopyId}
          className="bg-neutral-800 hover:bg-neutral-700 w-full py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'Copy ID to share with friends'}
        </button>
      </div>

      <form onSubmit={handleAdd} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl mb-8">
        <h2 className="text-white font-medium mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-red-500" />
          Add Trusted Contact
        </h2>
        
        <div className="flex flex-col gap-3">
          <input 
            type="text"
            placeholder="Friend's Safety ID (Required)"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
            required
          />
          <input 
            type="text"
            placeholder="Nickname (Required)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
            required
          />
          <input 
            type="tel"
            placeholder="Phone Number (Optional for SMS Fallback)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
          />
          <button 
            type="submit"
            disabled={!name || !friendId}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 mt-2 rounded-xl transition"
          >
            Save Contact
          </button>
        </div>
      </form>

      <div className="flex-1">
        <h3 className="text-neutral-500 uppercase text-xs font-bold tracking-wider mb-4">
          Your Network ({contacts.length})
        </h3>
        
        {contacts.length === 0 ? (
          <div className="text-center py-10 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
            <p className="text-neutral-500">No contacts added yet.<br/>Add a friend's Safety ID above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {contacts.map(c => (
              <div key={c.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="truncate">
                  <p className="font-bold text-white text-lg">{c.name}</p>
                  <p className="text-neutral-500 text-xs font-mono mt-1 break-all">ID: {c.id}</p>
                  {c.phone && <p className="text-neutral-500 text-xs mt-1">Tel: {c.phone}</p>}
                </div>
                <button 
                  onClick={() => removeContact(c.id)}
                  className="bg-red-950/30 text-red-500 hover:bg-red-900/50 p-3 rounded-xl transition flex-shrink-0 flex justify-center items-center"
                  title="Remove Contact"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
