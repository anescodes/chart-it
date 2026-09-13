import React, { useState } from 'react';
import { uploadCsvForAnalysis } from '../api/ai.api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UploadCloud, AlertCircle, TrendingUp, Cpu } from 'lucide-react';

interface AIAnalysisResult {
  total_spent: number;
  avg_transaction: number;
  anomalies_count: number;
  ai_insights: string;
  monthly_trend: { Month: string; Amount: number }[];
  anomalies: { Date: string; Amount: number; Category: string }[];
}

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
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Cpu className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">AI Financial Analyst</h1>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
        <UploadCloud className="w-12 h-12 text-gray-400" />
        <p className="text-gray-600">Upload your bank statement (CSV) for Gemini & Machine Learning analysis.</p>
        <div className="flex items-center space-x-4">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Data'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {error}</p>}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Gemini Insights
            </h3>
            <p className="text-blue-800 leading-relaxed">{result.ai_insights}</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">${result.total_spent.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Avg Transaction</p>
              <p className="text-2xl font-bold text-gray-900">${result.avg_transaction.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
              <p className="text-sm text-red-500 font-medium">Anomalies Detected</p>
              <p className="text-2xl font-bold text-red-700">{result.anomalies_count}</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Spending Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.monthly_trend}>
                  <XAxis dataKey="Month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="Amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}