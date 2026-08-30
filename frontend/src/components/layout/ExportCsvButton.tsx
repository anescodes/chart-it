import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { transactionApi } from '../../api/transaction.api'; // اضبط المسار لو لزم الأمر

export const ExportCsvButton: React.FC = () => {
  const [exporting, setExporting] = useState<boolean>(false);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const blob = await transactionApi.exportCsv();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `transactions-${new Date().toISOString().split('T')[0]}.csv`
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

  return (
    <button
      onClick={handleExportCsv}
      disabled={exporting}
      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
    >
      <Download className="w-4 h-4" />
      {exporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};