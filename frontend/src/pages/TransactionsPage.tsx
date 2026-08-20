import React, { useState } from 'react';
import { Search, Download, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

const INITIAL_TXS: Transaction[] = [
  { id: '1', title: 'Supermarket Grocery', category: 'Food & Dining', amount: 142.50, type: 'expense', date: '2026-08-19' },
  { id: '2', title: 'Freelance Design Payment', category: 'Income', amount: 1200.00, type: 'income', date: '2026-08-18' },
  { id: '3', title: 'Gas Station', category: 'Transportation', amount: 45.00, type: 'expense', date: '2026-08-17' },
  { id: '4', title: 'Netflix Subscription', category: 'Subscriptions', amount: 15.99, type: 'expense', date: '2026-08-15' },
];

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TXS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    const headers = 'ID,Title,Category,Amount,Type,Date\n';
    const rows = filtered.map(t => `${t.id},"${t.title}",${t.category},${t.amount},${t.type},${t.date}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Transactions History</h1>
          <p className="text-slate-400 text-xs mt-0.5">View, filter, and export all financial activity.</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {(['all', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterType === type ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="p-4">Transaction</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-white flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  {t.title}
                </td>
                <td className="p-4 text-slate-400">{t.category}</td>
                <td className="p-4 text-slate-400">{t.date}</td>
                <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};