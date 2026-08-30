import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, Wallet, Flame, PieChart, AlertCircle } from 'lucide-react';
import { transactionApi } from '../api/transaction.api';
import { analyticsApi, type AnalyticsResponse } from '../api/analytics.api';

type Timeframe = 'month' | 'quarter' | 'year';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  // جلب البيانات باستخدام getStats(timeframe) الجاهزة في API الخاص بك
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsApi.getStats(timeframe);
        setData(res);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe]);

  // دالة تصدير الـ CSV
  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const blob = await transactionApi.exportCsv();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `transactions-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`
      );

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      alert('Failed to export CSV file. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const metrics = data?.metrics;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PieChart className="w-7 h-7 text-emerald-500" />
            Financial Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {data?.insightTitle || 'Track your financial trends, income, and spending behavior.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
            {(['month', 'quarter', 'year'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400 animate-pulse">
          Loading analytics metrics...
        </div>
      ) : (
        <>
          {/* Main Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Income */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Income</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white">
                  ${metrics?.totalIncome ? Number(metrics.totalIncome).toLocaleString() : '0.00'}
                </h3>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Expenses</span>
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white">
                  ${metrics?.totalExpenses ? Number(metrics.totalExpenses).toLocaleString() : '0.00'}
                </h3>
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  {metrics?.expenseChangePct ?? 0}% vs previous {timeframe}
                </p>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Savings Rate</span>
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white">
                  {metrics?.savingsRate ?? 0}%
                </h3>
              </div>
            </div>

            {/* Avg Daily Burn */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Daily Burn</span>
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white">
                  ${metrics?.avgDailyBurn ? Number(metrics.avgDailyBurn).toLocaleString() : '0.00'}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">Per day</p>
              </div>
            </div>
          </div>

          {/* Categories Distribution & Weekly Outflow Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Breakdown */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4">Categories Breakdown</h2>
              <div className="space-y-4">
                {data?.categoriesDistribution?.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-medium">{cat.category}</span>
                      <span className="text-gray-400">${Number(cat.amount).toLocaleString()} ({cat.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.pct}%`,
                          backgroundColor: cat.color || '#10b981',
                        }}
                      />
                    </div>
                  </div>
                ))}
                {(!data?.categoriesDistribution || data.categoriesDistribution.length === 0) && (
                  <p className="text-sm text-gray-500">No category breakdown available.</p>
                )}
              </div>
            </div>

            {/* Weekly Outflow Breakdown */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4">Weekly Outflow</h2>
              <div className="space-y-4">
                {data?.weeklyOutflow?.map((week, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-medium">{week.week}</span>
                      <span className="text-gray-400">${Number(week.amount).toLocaleString()} ({week.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${week.pct}%`,
                          backgroundColor: week.color || '#3b82f6',
                        }}
                      />
                    </div>
                  </div>
                ))}
                {(!data?.weeklyOutflow || data.weeklyOutflow.length === 0) && (
                  <p className="text-sm text-gray-500">No weekly outflow data available.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};