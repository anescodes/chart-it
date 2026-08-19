import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  PieChart as PieIcon, 
  TrendingUp, 
  Plus, 
  Trash2, 
  LogOut,
  ArrowDownLeft
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useExpenseStore } from '../context/useExpenseStore';

export const DashboardPage: React.FC = () => {
  const { transactions, deleteTransaction } = useExpenseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // حساب الحسابات المالية مباشرة
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              Chart It
            </span>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-rose-400 text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Financial Overview</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time transactions and net balance analysis.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/25"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        {/* 1. Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Income"
            value={`$${totalIncome.toFixed(2)}`}
            subtext="Total earnings logged"
            icon={<ArrowDownLeft className="w-5 h-5 text-emerald-400" />}
          />
          <StatCard
            title="Total Expenses"
            value={`$${totalExpense.toFixed(2)}`}
            subtext="Total spent logged"
            icon={<Wallet className="w-5 h-5 text-rose-400" />}
          />
          <StatCard
            title="Net Balance"
            value={`$${netBalance.toFixed(2)}`}
            subtext="Remaining liquid cash"
            icon={<ArrowUpRight className="w-5 h-5 text-indigo-400" />}
          />
          <StatCard
            title="Total Records"
            value={transactions.length.toString()}
            subtext="Active transactions"
            icon={<PieIcon className="w-5 h-5 text-amber-400" />}
          />
        </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">Activity Timeline</h3>
            <TrendChart transactions={transactions} />
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">Category Distribution</h3>
            <CategoryPieChart transactions={transactions} />
          </div>
        </div>

        {/* 3. Recent Transactions Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 font-medium text-slate-200">{tx.description || 'No description'}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-lg font-medium">
                        {tx.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 text-xs">{tx.transactionDate}</td>
                    <td className={`py-3.5 font-semibold text-right ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

// Sub Components
const StatCard = ({ title, value, subtext, icon }: any) => (
  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-md space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
      <div className="p-2.5 bg-slate-800/80 rounded-xl">{icon}</div>
    </div>
    <div className="space-y-1">
      <div className="text-2xl font-black tracking-tight">{value}</div>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  </div>
);

const TrendChart = ({ transactions }: any) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={transactions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="transactionDate" stroke="#64748b" fontSize={11} tickLine={false} />
        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} />
        <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

const CategoryPieChart = ({ transactions }: any) => {
  const chartData = transactions.map((t: any, index: number) => ({
    name: t.category?.name || 'General',
    value: t.amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const AddTransactionModal = ({ onClose }: { onClose: () => void }) => {
  const addTransaction = useExpenseStore((state) => state.addTransaction);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      transactionDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
        <h3 className="text-xl font-bold">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${type === 'EXPENSE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-950 text-slate-400'}`}
              >
                EXPENSE
              </button>
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-950 text-slate-400'}`}
              >
                INCOME
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Salary, Supermarket"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};