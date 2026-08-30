import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  TrendingUp,
  Wallet,
  Calendar,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { analyticsApi, type AnalyticsResponse } from '../api/analytics.api';

type TimeframeOption = 'month' | 'quarter' | 'year';

const formatCurrency = (val: number = 0) => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 2 
  }).format(val);

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('month');
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await analyticsApi.getStats(timeframe);
      setData(res);
    } catch (err: any) {
      console.error('Failed to fetch analytics stats:', err);
      setError(err?.response?.data?.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const metrics = data?.metrics;

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Header & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4" /> Reports & Metrics
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Financial Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">
            Deep dive into your spending distribution, income vs. expense balance, and period trends.
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl self-start sm:self-auto shadow-inner">
          {(['month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200 ${
                timeframe === period 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {period === 'month' ? 'This Month' : period === 'quarter' ? 'This Quarter' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">Computing financial breakdown...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-6 flex items-center gap-4 text-rose-300">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
          <div className="flex-1">
            <h3 className="font-bold text-sm">Error Loading Stats</h3>
            <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
          </div>
          <button 
            onClick={fetchAnalytics} 
            className="px-3 py-1.5 bg-rose-900/50 hover:bg-rose-800/60 text-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {!loading && data && (
        <>
          {/* 2. Insight Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-2xl shadow-xl shadow-indigo-950/20">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-indigo-400" /> Automated Insight
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{data.insightTitle}</h2>
                <p className="text-slate-400 text-xs">
                  Analyzed against your historical activity for the selected {timeframe} window.
                </p>
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Total Inflow</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">{formatCurrency(metrics?.totalIncome)}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Total Outflow</div>
                  <div className="text-sm font-extrabold text-rose-400 mt-0.5">{formatCurrency(metrics?.totalExpenses)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Avg Daily Burn */}
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Avg. Daily Burn</span>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{formatCurrency(metrics?.avgDailyBurn)}</div>
                <div className={`flex items-center gap-1 text-[11px] font-semibold mt-1 ${(metrics?.expenseChangePct || 0) <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {(metrics?.expenseChangePct || 0) <= 0 ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(metrics?.expenseChangePct || 0)}% vs last period
                </div>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Savings Rate</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">{metrics?.savingsRate}%</div>
                <p className="text-slate-400 text-[11px] mt-1">Net income retained after expenses</p>
              </div>
            </div>

            {/* Top Spending Category */}
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Top Category</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <PieChart className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white capitalize truncate">
                  {metrics?.highestCategory || 'None'}
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Represents <span className="text-indigo-300 font-bold">{metrics?.highestCategoryPct}%</span> of total spend
                </p>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Expenses</span>
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-rose-400">{formatCurrency(metrics?.totalExpenses)}</div>
                <p className="text-slate-400 text-[11px] mt-1">Aggregated for selected {timeframe}</p>
              </div>
            </div>

          </div>

          {/* 4. Visual Graphs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weekly Outflow Breakdown */}
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 space-y-6 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Weekly Outflow Progress</h3>
                    <p className="text-slate-400 text-xs">Expense totals per week segment</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full capitalize">
                  {timeframe}
                </span>
              </div>

              <div className="space-y-4">
                {data.weeklyOutflow.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold">{item.week}</span>
                      <span className="text-white font-bold">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                      <div 
                        className={`h-full ${item.color || 'bg-indigo-500'} rounded-full transition-all duration-700 ease-out`} 
                        style={{ width: `${Math.max(item.pct, 3)}%` }} 
                      />
                    </div>
                  </div>
                ))}
                {data.weeklyOutflow.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-8">No transaction data recorded for this period.</p>
                )}
              </div>
            </div>

            {/* Category Spending Distribution */}
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 space-y-6 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Spending Distribution</h3>
                    <p className="text-slate-400 text-xs">Expense split across category buckets</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                  {data.categoriesDistribution.length} Categories
                </span>
              </div>

              <div className="space-y-4">
                {data.categoriesDistribution.map((cat, idx) => {
                  const isHexColor = cat.color?.startsWith('#');
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-semibold capitalize">{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px] font-medium">{cat.pct}%</span>
                          <span className="text-white font-bold">{formatCurrency(cat.amount)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            !isHexColor ? cat.color || 'bg-indigo-500' : ''
                          }`}
                          style={{ 
                            width: `${Math.max(cat.pct, 3)}%`,
                            backgroundColor: isHexColor ? cat.color : undefined 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
                {data.categoriesDistribution.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-8">No categorized expenses available.</p>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};