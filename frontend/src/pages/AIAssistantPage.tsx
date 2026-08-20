import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  FileText, 
  UploadCloud, 
  ArrowRight,
  User
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hello Anes! I analyzed your spending patterns for August. You are on track with your budget, but food expenses increased by 14%. How can I help you today?',
      time: '10:00 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', text: input, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: 'I have logged your request. Based on your current cashflow, setting a $150 limit on dining out will help you reach your monthly savings target 5 days earlier!',
        time: 'Just now'
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-10 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" /> AI Copilot Engine
        </div>
        <h1 className="text-2xl font-extrabold text-white">Financial AI Hub</h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Ask questions, analyze receipts, and receive real-time automated budget optimization tips.
        </p>
      </div>

      {/* Top AI Insights Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-xl flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-white">Anomalous Spending Detected</div>
            <p className="text-[11px] text-slate-400">Shopping expenses are 30% higher than your 3-month average.</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-xl flex items-start gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-white">Smart Savings Opportunity</div>
            <p className="text-[11px] text-slate-400">Cancel 1 unused subscription to save up to $180 every year.</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-4 backdrop-blur-xl flex items-start gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-white">Weekly AI Executive Summary</div>
            <p className="text-[11px] text-slate-400">Your overall health score is 88/100. Excellent savings pace.</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Chat & Receipt Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chat UI (Takes 2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between h-[480px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">ChartIt Financial Assistant</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online & Connected
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg">
              LLM Model: GPT-4o
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`p-1.5 rounded-xl text-white ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}>
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] text-slate-500 block mt-1 text-right">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                <Bot className="w-3.5 h-3.5 animate-spin" /> AI is generating insights...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800/80 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your money, budgets, or forecast..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* OCR Receipt Upload Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800/80 pb-3">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
              Smart OCR Receipt Scanner
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Upload any paper receipt or invoice. Our Vision AI extracts total amounts and categories automatically.
            </p>

            {/* Drag and drop zone UI */}
            <div className="mt-6 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center space-y-3 cursor-pointer bg-slate-950/50 transition-all">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Click or drag receipt image</div>
                <div className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, PDF up to 10MB</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vision OCR Capabilities</div>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-400" /> Auto merchant detection</li>
              <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-400" /> Tax & Total extraction</li>
              <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-400" /> One-click DB Sync</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};