import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  PieChart, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Financial Analytics</h1>
          <p className="text-slate-400 text-xs mt-0.5">Automated spending behavior, trends, and budget metrics.</p>
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
          {(['month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeframe === period 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {period === 'month' ? 'This Month' : period === 'quarter' ? 'This Quarter' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Insight Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wide">
            <Award className="w-4 h-4" /> Optimization Insight
          </div>
          <h2 className="text-base font-bold text-white">You saved 14.2% more this month compared to last period</h2>
          <p className="text-slate-400 text-xs">Food & Dining spending saw the biggest drop after mid-month.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-lg shadow-indigo-600/20">
          Download Analysis Report
        </button>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl space-y-2">
          <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Avg. Daily Burn</span>
          <div className="text-2xl font-extrabold text-white">$48.20</div>
          <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" /> -6.5% vs average
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl space-y-2">
          <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Savings Rate</span>
          <div className="text-2xl font-extrabold text-emerald-400">32.4%</div>
          <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +4.1% target pace
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl space-y-2">
          <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Highest Category</span>
          <div className="text-2xl font-extrabold text-white">Housing</div>
          <div className="text-slate-400 text-[11px]">42% of total outflow</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl space-y-2">
          <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Recurring Costs</span>
          <div className="text-2xl font-extrabold text-indigo-400">$340.00</div>
          <div className="text-slate-400 text-[11px]">5 subscriptions active</div>
        </div>
      </div>

      {/* Analytics Main Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Expense Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Weekly Outflow Progress
            </h3>
            <span className="text-xs text-slate-400">Aug 2026</span>
          </div>

          <div className="space-y-4 pt-1">
            {[
              { week: 'Week 1 (Aug 1 - 7)', amount: '$850.00', pct: 75, color: 'bg-indigo-500' },
              { week: 'Week 2 (Aug 8 - 14)', amount: '$1,120.00', pct: 90, color: 'bg-indigo-500' },
              { week: 'Week 3 (Aug 15 - 21)', amount: '$640.00', pct: 55, color: 'bg-emerald-500' },
              { week: 'Week 4 (Aug 22 - 28)', amount: '$420.00 (Est)', pct: 35, color: 'bg-slate-700' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300 font-semibold">{item.week}</span>
                  <span className="text-white font-bold">{item.amount}</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Progress */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" /> Spending Distribution
            </h3>
            <span className="text-xs text-slate-400">By Category</span>
          </div>

          <div className="space-y-4 pt-1">
            {[
              { category: 'Housing & Rent', amount: '$1,200.00', pct: 42, color: 'bg-indigo-500' },
              { category: 'Food & Dining', amount: '$680.00', pct: 24, color: 'bg-emerald-500' },
              { category: 'Transportation', amount: '$310.00', pct: 11, color: 'bg-sky-500' },
              { category: 'Shopping', amount: '$290.00', pct: 10, color: 'bg-amber-500' },
              { category: 'Entertainment', amount: '$370.00', pct: 13, color: 'bg-purple-500' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300 font-semibold">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{cat.pct}%</span>
                    <span className="text-white font-bold">{cat.amount}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                  <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};