import type { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';

export const analyzeCsvController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file provided.' });
    }

    // Prepare form data to proxy to FastAPI
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Send to Python Microservice
    const response = await axios.post('http://localhost:8000/api/v1/analyze-csv', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-KEY': process.env.AI_SERVICE_API_KEY || 'your-internal-secret-key',
      },
    });

    // Return the successful FastAPI response to the React frontend
    return res.status(200).json(response.data);
    
  } catch (error: any) {
    console.error('FastAPI Proxy Error:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.detail || 'Failed to process CSV file.';
    return res.status(statusCode).json({ error: message });
  }
};