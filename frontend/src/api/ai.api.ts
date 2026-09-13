// Ensure your axios instance is configured with base URL (e.g., http://localhost:5000/api)
import { apiClient } from './client'; 

export const uploadCsvForAnalysis = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/ai/analyze-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};