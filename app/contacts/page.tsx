"use client";
import React, { useState } from 'react';
import { useAppStore } from '@/lib/Store';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react';

export default function ContactsPage() {
  const { contacts, addContact, removeContact } = useAppStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    addContact({
      id: Date.now().toString(),
      name,
      phone
    });
    setName('');
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Trusted Contacts</h1>
      </header>

      <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-8">
        <h2 className="text-slate-300 font-medium mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-400" />
          Add New Contact
        </h2>
        
        <div className="flex flex-col gap-3">
          <input 
            type="text"
            placeholder="Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
          <input 
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
          <button 
            type="submit"
            disabled={!name || !phone}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 mt-2 rounded-xl transition"
          >
            Save Contact
          </button>
        </div>
      </form>

      <div className="flex-1">
        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-4">
          Your Emergency Contacts ({contacts.length})
        </h3>
        
        {contacts.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-500">No contacts added yet.<br/>Add a trusted contact above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {contacts.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-100">{c.name}</p>
                  <p className="text-slate-500 text-sm">{c.phone}</p>
                </div>
                <button 
                  onClick={() => removeContact(c.id)}
                  className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                  aria-label="Remove contact"
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
