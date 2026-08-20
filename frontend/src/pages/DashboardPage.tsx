import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  PieChart as PieIcon, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Tv, 
  Plus, 
  X,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles
} from 'lucide-react';

export interface CategoryStat {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  icon: any;
  color: string;
  text: string;
}

export const DashboardPage: React.FC = () => {
  // State for Categories Stats
  const [categories, setCategories] = useState<CategoryStat[]>([
    { id: '1', name: 'Food & Dining', amount: 1250, percentage: 38, icon: Utensils, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { id: '2', name: 'Housing & Rent', amount: 900, percentage: 28, icon: Home, color: 'bg-indigo-500', text: 'text-indigo-400' },
    { id: '3', name: 'Shopping', amount: 450, percentage: 14, icon: ShoppingBag, color: 'bg-amber-500', text: 'text-amber-400' },
    { id: '4', name: 'Transportation', amount: 350, percentage: 11, icon: Car, color: 'bg-sky-500', text: 'text-sky-400' },
    { id: '5', name: 'Subscriptions', amount: 280, percentage: 9, icon: Tv, color: 'bg-violet-500', text: 'text-violet-400' },
  ]);

  // Overall Financial States
  const [totalBalance, setTotalBalance] = useState(8420);
  const [monthlyIncome, setMonthlyIncome] = useState(5200);
  const [totalExpenses, setTotalExpenses] = useState(3230);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState(categories[0].name);
  const [txTitle, setTxTitle] = useState('');

  // Handle Adding New Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(txAmount);
    if (!val || val <= 0) return;

    if (txType === 'expense') {
      setTotalExpenses((prev) => prev + val);
      setTotalBalance((prev) => prev - val);

      // Update category total amount
      setCategories((prev) => {
        const updated = prev.map((cat) =>
          cat.name === txCategory ? { ...cat, amount: cat.amount + val } : cat
        );
        const newTotalSpent = updated.reduce((acc, curr) => acc + curr.amount, 0);
        return updated.map((cat) => ({
          ...cat,
          percentage: Math.round((cat.amount / newTotalSpent) * 100),
        }));
      });
    } else {
      setMonthlyIncome((prev) => prev + val);
      setTotalBalance((prev) => prev + val);
    }

    // Reset and Close
    setTxAmount('');
    setTxTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time overview of cashflow, monthly trends, and expense breakdowns.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Balance</span>
            <Wallet className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">${totalBalance.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Monthly Income</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">${monthlyIncome.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Salary & Freelance</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Expenses</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">${totalExpenses.toLocaleString()}</div>
          <div className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> +4.2% over target budget
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Analytics Chart */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Income vs Expenses Trend</h2>
              <p className="text-[11px] text-slate-500">Monthly breakdown for 2026</p>
            </div>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
              August 2026
            </span>
          </div>

          {/* Clean Vector SVG Area Chart */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Income Area & Line */}
              <path d="M 0,140 Q 100,100 200,60 T 400,40 T 500,20 L 500,170 L 0,170 Z" fill="url(#incomeGrad)" />
              <path d="M 0,140 Q 100,100 200,60 T 400,40 T 500,20" fill="none" stroke="#10b981" strokeWidth="3" />

              {/* Expense Area & Line */}
              <path d="M 0,160 Q 100,130 200,110 T 400,90 T 500,80 L 500,170 L 0,170 Z" fill="url(#expenseGrad)" />
              <path d="M 0,160 Q 100,130 200,110 T 400,90 T 500,80" fill="none" stroke="#6366f1" strokeWidth="3" />
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-400 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-slate-400 font-medium">Expenses</span>
            </div>
          </div>
        </div>

        {/* Expenses by Category Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" /> Categories Share
            </h2>
            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
              Auto-Calculated
            </span>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-800 ${cat.text}`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-300">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">${cat.amount.toLocaleString()}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Add New Transaction
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    txType === 'expense'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    txType === 'income'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title / Description</label>
                <input
                  type="text"
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="e.g. Grocery Store, Client Payment..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Category Select (Only for Expenses) */}
              {txType === 'expense' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Select Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};