"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, ArrowLeft, Bot, User, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

interface Msg {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function RakshaAIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello. I am Raksha AI. I am your personal safety assistant and advocate. You can speak to me in any language (Hindi, Kannada, Tamil, English, etc.), and I will right back. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMsg: Msg = { id: Date.now().toString(), role: 'user', content: input };
    const chatHistory = [...messages, newMsg];
    
    setMessages(chatHistory);
    setInput('');
    setIsLoading(true);
    setErrorText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to connect to Raksha AI");
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply
      }]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 p-4 flex items-center gap-4">
        <Link href="/tools" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500/20 border border-rose-500/50 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight uppercase tracking-widest">Raksha AI</h1>
            <p className="text-rose-400 text-[10px] uppercase tracking-widest font-bold">Secure Connection</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
        {errorText && (
          <div className="bg-red-950/50 border border-red-500/50 p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{errorText}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-neutral-800' : 'bg-rose-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-neutral-400" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              
              <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-neutral-800 text-white rounded-tr-sm' 
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 rounded-tl-sm flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-800 p-4 pb-safe">
        <form 
          className="max-w-3xl mx-auto flex items-end gap-2"
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        >
          <div className="flex-1 bg-neutral-900 border border-neutral-700 rounded-3xl overflow-hidden focus-within:border-rose-500 transition-colors">
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask anything securely..."
              className="w-full bg-transparent text-white px-5 py-4 outline-none resize-none max-h-32 placeholder-neutral-500"
              style={{ minHeight: '56px' }}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-14 h-14 bg-rose-600 rounded-full flex items-center justify-center text-white flex-shrink-0 hover:bg-rose-500 disabled:opacity-50 transition active:scale-95 shadow-[0_0_15px_rgba(225,29,72,0.4)]"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>

    </div>
  );
}
