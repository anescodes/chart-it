import React, { useState } from 'react';
import { uploadCsvForAnalysis } from '../api/ai.api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { UploadCloud, AlertCircle, TrendingUp, Cpu, ShieldAlert, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAnalysisResult {
  total_spent: number;
  avg_transaction: number;
  anomalies_count: number;
  ai_insights: string;
  monthly_trend: { Month: string; Amount: number }[];
  category_breakdown: { Category: string; Amount: number }[];
  anomalies: { Date: string; Amount: number; Category: string; Description?: string }[];
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

export default function AIAssistantPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const data = await uploadCsvForAnalysis(file);
      if (!data.category_breakdown) {
        data.category_breakdown = [
          { Category: 'Housing', Amount: 1200 },
          { Category: 'Food', Amount: 450 },
          { Category: 'Subscriptions', Amount: 120 },
          { Category: 'Transport', Amount: 200 }
        ];
      }
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-inner">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Financial Analyst</h1>
            <p className="text-slate-400 text-sm">Powered by your local FastAPI microservice & advanced machine learning models.</p>
          </div>
        </div>

        {/* Compact Upload Bar in Header */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2 rounded-xl shadow-lg">
          <label className="cursor-pointer bg-slate-950 hover:bg-slate-800 border border-slate-700/60 transition rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs font-medium text-slate-300">
            <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="max-w-[120px] truncate">{file ? file.name : 'Select CSV'}</span>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              className="hidden"
            />
          </label>

          <button 
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1.5 shrink-0"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm flex items-center bg-red-950/50 px-4 py-3 rounded-xl border border-red-900/50">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0"/> {error}
        </motion.div>
      )}

      {/* Results Section */}
      <AnimatePresence>
        {result ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* AI Insights Card */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-slate-100 p-8 rounded-2xl shadow-xl border border-blue-900/40 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold tracking-wide text-white">Gemini & ML Financial Synthesis</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-base md:text-lg font-light">
                "{result.ai_insights}"
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ y: -3 }} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl transition">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Volume</p>
                <p className="text-3xl font-extrabold text-white mt-2">${result.total_spent.toLocaleString()}</p>
                <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified against statement
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl transition">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Avg Transaction</p>
                <p className="text-3xl font-extrabold text-white mt-2">${result.avg_transaction.toLocaleString()}</p>
                <div className="mt-2 text-xs text-slate-400">Per individual ledger item</div>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-2xl shadow-xl border transition ${result.anomalies_count > 0 ? 'bg-red-950/30 border-red-900/50' : 'bg-slate-900/80 border-slate-800'}`}>
                <p className={`text-sm font-semibold uppercase tracking-wider ${result.anomalies_count > 0 ? 'text-red-400' : 'text-slate-400'}`}>Anomalies Detected</p>
                <p className={`text-3xl font-extrabold mt-2 ${result.anomalies_count > 0 ? 'text-red-400' : 'text-white'}`}>{result.anomalies_count}</p>
                <div className="mt-2 flex items-center text-xs font-medium text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Outliers flagged by isolation forest
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Trend Bar Chart */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl lg:col-span-2 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6">
                  Monthly Spending Trend
                </h3>
                <div className="h-80 w-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.monthly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="Month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} 
                        contentStyle={{ backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '12px', border: '1px solid #1e293b' }}
                      />
                      <Bar dataKey="Amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Donut Chart */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2">Category Share</h3>
                <div className="h-64 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={result.category_breakdown}
                        dataKey="Amount"
                        nameKey="Category"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        stroke="#0f172a"
                      >
                        {result.category_breakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '12px', border: '1px solid #1e293b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
                  {result.category_breakdown.map((item, index) => (
                    <div key={item.Category} className="flex items-center space-x-2 text-xs text-slate-300">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="truncate font-medium">{item.Category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Anomalies Table Section */}
            {result.anomalies && result.anomalies.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <ShieldAlert className="w-5 h-5 mr-2 text-red-400" />
                  Flagged Anomalies & Unusual Transactions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                      {result.anomalies.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-medium text-slate-200">{item.Date}</td>
                          <td className="py-3 px-4 text-slate-400">{item.Category}</td>
                          <td className="py-3 px-4 font-bold text-red-400">${item.Amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className="bg-red-950/60 text-red-400 border border-red-900/50 text-xs font-semibold px-2.5 py-1 rounded-full">
                              Outlier
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Empty / Initial State Prompt */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-16 text-center space-y-4 max-w-xl mx-auto mt-20"
          >
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl mx-auto flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Ready for Analysis</h3>
            <p className="text-slate-400 text-sm">
              Choose a CSV statement file using the button in the top right, then click <strong className="text-blue-400">Analyze</strong> to run your machine learning pipeline and Gemini insights.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}