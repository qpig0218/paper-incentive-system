import axios from 'axios';
import type {
  Paper,
  PaperApplication,
  Announcement,
  User,
  AIAnalysisResult,
  ExcelAnalysisResult,
  DashboardStats,
  CareerRecord,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Paper APIs
export const paperApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    year?: number;
  }): Promise<{ papers: Paper[]; total: number; page: number; totalPages: number }> => {
    const response = await api.get('/papers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Paper> => {
    const response = await api.get(`/papers/${id}`);
    return response.data;
  },

  create: async (data: Partial<Paper>): Promise<Paper> => {
    const response = await api.post('/papers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Paper>): Promise<Paper> => {
    const response = await api.put(`/papers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/papers/${id}`);
  },

  uploadPdf: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/papers/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Application APIs
export const applicationApi = {
  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: PaperApplication[]; total: number }> => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  getById: async (id: string): Promise<PaperApplication> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  create: async (data: {
    paperId: string;
    authorRole: string;
  }): Promise<PaperApplication> => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  submit: async (id: string): Promise<PaperApplication> => {
    const response = await api.post(`/applications/${id}/submit`);
    return response.data;
  },

  review: async (
    id: string,
    data: { status: 'approved' | 'rejected'; notes?: string }
  ): Promise<PaperApplication> => {
    const response = await api.post(`/applications/${id}/review`, data);
    return response.data;
  },

  getMyApplications: async (): Promise<PaperApplication[]> => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string; deletedStatus: string }> => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

// AI APIs
export const aiApi = {
  analyzePdf: async (file: File): Promise<AIAnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/ai/analyze-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  classifyPaper: async (text: string): Promise<{
    paperType: string;
    confidence: number;
  }> => {
    const response = await api.post('/ai/classify', { text });
    return response.data;
  },

  extractFields: async (text: string): Promise<AIAnalysisResult['extractedFields']> => {
    const response = await api.post('/ai/extract-fields', { text });
    return response.data;
  },

  analyzeContent: async (text: string): Promise<AIAnalysisResult['contentAnalysis']> => {
    const response = await api.post('/ai/analyze-content', { text });
    return response.data;
  },

  lookupJournal: async (journalName: string, year?: number): Promise<{
    journal: {
      name: string;
      impactFactor: number;
      quartile: string;
      ranking: number;
      totalInField: number;
    } | null;
  }> => {
    const response = await api.get('/ai/lookup-journal', {
      params: { name: journalName, year },
    });
    return response.data;
  },

  calculateReward: async (paperId: string, authorRole: string): Promise<{
    calculation: {
      baseAmount: number;
      bonuses: { type: string; percentage: number; amount: number }[];
      totalAmount: number;
    };
  }> => {
    const response = await api.post('/ai/calculate-reward', { paperId, authorRole });
    return response.data;
  },

  analyzeExcel: async (file: File): Promise<{ success: boolean; data: ExcelAnalysisResult }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/ai/analyze-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getExcelData: async (fileId: string, params?: {
    search?: string;
    sheetName?: string;
    columns?: string;
    page?: number;
    limit?: number;
  }): Promise<any> => {
    const response = await api.get(`/ai/excel-data/${fileId}`, { params });
    return response.data;
  },

  askAboutExcel: async (fileId: string, question: string): Promise<{ success: boolean; data: { answer: string } }> => {
    const response = await api.post('/ai/excel-ask', { fileId, question });
    return response.data;
  },
};

// Announcement APIs
export const announcementApi = {
  getActive: async (): Promise<Announcement[]> => {
    const response = await api.get('/announcements/active');
    return response.data;
  },

  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get('/announcements');
    return response.data;
  },

  create: async (data: Partial<Announcement>): Promise<Announcement> => {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Announcement>): Promise<Announcement> => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}`);
  },
};

// User APIs
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getCareerRecords: async (userId?: string): Promise<CareerRecord[]> => {
    const response = await api.get('/users/career-records', {
      params: { userId },
    });
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

// Auth APIs
export const authApi = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export default api;
