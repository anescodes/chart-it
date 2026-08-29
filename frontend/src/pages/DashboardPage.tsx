import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2,
  Tag,
  PlusCircle,
  X,
  AreaChart as AreaIcon,
  BarChart3 as BarIcon,
  LineChart as LineIcon,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { transactionApi } from '../api/transaction.api';
import { categoryApi } from '../api/category.api';

export interface CategoryStat {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  text: string;
}

const COLOR_PALETTE = [
  { color: 'bg-emerald-500', text: 'text-emerald-400' },
  { color: 'bg-indigo-500', text: 'text-indigo-400' },
  { color: 'bg-amber-500', text: 'text-amber-400' },
  { color: 'bg-sky-500', text: 'text-sky-400' },
  { color: 'bg-violet-500', text: 'text-violet-400' },
  { color: 'bg-rose-500', text: 'text-rose-400' },
];

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rawTransactions, setRawTransactions] = useState<any[]>([]);
  const [categoriesStats, setCategoriesStats] = useState<CategoryStat[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  // إعدادات نوع الرسم البياني والـ Aggregation
  const [chartView, setChartView] = useState<'NET' | 'AREA' | 'BAR'>('NET');
  const [timeGroupBy, setTimeGroupBy] = useState<'DAY' | 'MONTH'>('DAY');

  // إعدادات النافذة المنبثقة (Modal)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amountInput, setAmountInput] = useState<string>('');
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);

      const [transactions, categories] = await Promise.all([
        transactionApi.getAll(),
        categoryApi.getAll(),
      ]);

      setRawTransactions(transactions);
      setCategoriesList(categories);

      let incomeSum = 0;
      let expenseSum = 0;
      const categoryExpenseMap: Record<string, number> = {};

      transactions.forEach((tx: any) => {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'INCOME') {
          incomeSum += amt;
        } else if (tx.type === 'EXPENSE') {
          expenseSum += amt;
          const catId = tx.categoryId || tx.category?.id || 'uncategorized';
          categoryExpenseMap[catId] = (categoryExpenseMap[catId] || 0) + amt;
        }
      });

      setTotalIncome(incomeSum);
      setTotalExpenses(expenseSum);
      setTotalBalance(incomeSum - expenseSum);

      const computedStats: CategoryStat[] = categories.map((cat: any, idx: number) => {
        const spent = categoryExpenseMap[cat.id] || 0;
        const percentage = expenseSum > 0 ? Math.round((spent / expenseSum) * 100) : 0;
        const style = COLOR_PALETTE[idx % COLOR_PALETTE.length];

        return {
          id: cat.id,
          name: cat.name,
          amount: spent,
          percentage,
          color: style.color,
          text: style.text,
        };
      });

      setCategoriesStats(computedStats);
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  // تجميع وإعداد البيانات للمخططات البيانية
  const chartData = useMemo(() => {
    if (!rawTransactions || rawTransactions.length === 0) return [];

    const sortedTx = [...rawTransactions].sort((a, b) => 
      new Date(a.transactionDate || a.createdAt).getTime() - new Date(b.transactionDate || b.createdAt).getTime()
    );

    const dateMap: Record<string, { income: number; expense: number }> = {};

    sortedTx.forEach((tx) => {
      const d = new Date(tx.transactionDate || tx.createdAt);
      const dateKey = timeGroupBy === 'DAY'
        ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { income: 0, expense: 0 };
      }

      const amt = Number(tx.amount) || 0;
      if (tx.type === 'INCOME') {
        dateMap[dateKey].income += amt;
      } else if (tx.type === 'EXPENSE') {
        dateMap[dateKey].expense += amt;
      }
    });

    let runningBalance = 0;
    return Object.keys(dateMap).map((key) => {
      const inc = dateMap[key].income;
      const exp = dateMap[key].expense;
      runningBalance += (inc - exp);

      return {
        date: key,
        income: inc,
        expense: exp,
        balance: runningBalance,
      };
    });
  }, [rawTransactions, timeGroupBy]);

  const openAddModal = (type: 'INCOME' | 'EXPENSE') => {
    setTxType(type);
    setAmountInput('');
    setDescriptionInput('');
    setDateInput(new Date().toISOString().split('T')[0]);
    if (categoriesList.length > 0) {
      setSelectedCatId(categoriesList[0].id);
    }
    setIsModalOpen(true);
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || Number(amountInput) <= 0) return;

    try {
      setSubmitting(true);
      await transactionApi.create({
        amount: Number(amountInput),
        type: txType,
        categoryId: txType === 'EXPENSE' ? (selectedCatId || undefined) : undefined,
        description: descriptionInput,
        transactionDate: new Date(dateInput).toISOString(),
      });

      setIsModalOpen(false);
      await fetchDashboardAnalytics();
    } catch (err) {
      console.error('Failed to add transaction:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !isModalOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-xs font-medium">Loading financial analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time balance trends and category expense analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAddModal('INCOME')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Add Income
          </button>
          <button
            onClick={() => openAddModal('EXPENSE')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Balance</span>
            <Wallet className="w-4 h-4 text-indigo-400" />
          </div>
          <div className={`text-2xl font-bold mt-2 tracking-tight ${totalBalance >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
            {formatCurrency(totalBalance)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1.5 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Cumulative Net
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Income</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2 tracking-tight">
            {formatCurrency(totalIncome)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 font-medium">Total Revenue</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Expenses</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2 tracking-tight">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="text-[11px] text-rose-400 mt-1.5 font-medium flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Outflow
          </div>
        </div>
      </div>

      {/* Main Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Main Visualization Container */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
          
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Financial Trend</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {chartView === 'NET' ? 'Cumulative net balance progression over time' : 'Income vs Expense cashflow visualizer'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setTimeGroupBy('DAY')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    timeGroupBy === 'DAY' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Days
                </button>
                <button
                  onClick={() => setTimeGroupBy('MONTH')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    timeGroupBy === 'MONTH' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Months
                </button>
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setChartView('NET')}
                  title="Net Balance Trend (Stripe/Revolut Style)"
                  className={`p-1.5 rounded-md transition-all ${
                    chartView === 'NET' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LineIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setChartView('AREA')}
                  title="Income & Expense Area"
                  className={`p-1.5 rounded-md transition-all ${
                    chartView === 'AREA' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AreaIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setChartView('BAR')}
                  title="Grouped Bar Chart"
                  className={`p-1.5 rounded-md transition-all ${
                    chartView === 'BAR' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Render Active Chart View */}
          <div className="h-64 w-full pt-4">
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs space-y-2">
                <Calendar className="w-8 h-8 stroke-1 text-slate-600" />
                <p>No transactions recorded to show timeline.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'NET' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }} 
                      formatter={(val: any) => [formatCurrency(Number(val)), 'Net Balance']}
                    />
                    <Area type="monotone" dataKey="balance" name="Net Balance" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#netGrad)" />
                  </AreaChart>
                ) : chartView === 'AREA' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }} 
                      formatter={(val: any, name: any) => [formatCurrency(Number(val)), name === 'income' ? 'Income' : 'Expense']}
                    />
                    <Area type="monotone" dataKey="income" name="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
                    <Area type="monotone" dataKey="expense" name="expense" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any, name: any) => [formatCurrency(Number(val)), name === 'income' ? 'Income' : 'Expense']}
                    />
                    <Bar dataKey="income" name="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            {chartView === 'NET' ? (
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Cumulative Net Trend
              </span>
            ) : (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Expense
                </span>
              </div>
            )}
            <span>Savings Rate: <strong className="text-slate-200">{totalIncome > 0 ? `${Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))}%` : '0%'}</strong></span>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" /> Expenses by Category
            </h2>
          </div>

          <div className="space-y-4">
            {categoriesStats.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6">No categories recorded yet.</p>
            ) : (
              categoriesStats.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md bg-slate-950 border border-slate-800 ${cat.text}`}>
                        <Tag className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-slate-300">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-100">{formatCurrency(cat.amount)}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal المعاملات مع حقل التاريخ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-semibold text-slate-100">
                Add {txType === 'INCOME' ? 'Income' : 'Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Transaction Date</label>
                <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {txType === 'EXPENSE' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Optional description..."
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all flex items-center justify-center min-w-[110px] ${
                    txType === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};