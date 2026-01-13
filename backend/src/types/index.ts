// Paper Types
export type PaperType =
  | 'original'
  | 'case_report'
  | 'review'
  | 'letter'
  | 'note'
  | 'communication'
  | 'image'
  | 'abstract_poster'
  | 'abstract_oral'
  | 'comment'
  | 'book_chapter'
  | 'translation';

export type JournalType = 'sci' | 'ssci' | 'non_sci';

export type ApplicantType = 'first_author' | 'corresponding' | 'co_author';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'revision';

export type AuthorRole = 'first' | 'corresponding' | 'co_first' | 'co_corresponding' | 'second' | 'third_to_sixth';

// Interfaces
export interface Author {
  id: string;
  name: string;
  email?: string;
  affiliation: string;
  department?: string;
  isFirst: boolean;
  isCorresponding: boolean;
  order: number;
}

export interface JournalInfo {
  name: string;
  abbreviation?: string;
  isSci: boolean;
  isSsci: boolean;
  impactFactor?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  ranking?: number;
  totalInField?: number;
  category?: string;
}

export interface ConferenceInfo {
  name: string;
  location: string;
  date: string;
  type: 'international' | 'domestic';
  presentationType: 'oral' | 'poster';
}

export interface Paper {
  id: string;
  title: string;
  titleChinese?: string;
  authors: Author[];
  paperType: PaperType;
  journalInfo?: JournalInfo;
  conferenceInfo?: ConferenceInfo;
  publicationDate?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardBonus {
  type: string;
  description: string;
  percentage: number;
  amount: number;
}

export interface RewardDeduction {
  type: string;
  description: string;
  percentage: number;
  amount: number;
}

export interface RewardCalculation {
  baseAmount: number;
  bonuses: RewardBonus[];
  deductions: RewardDeduction[];
  totalAmount: number;
  formula: string;
}

export interface PaperApplication {
  id: string;
  paperId: string;
  applicantId: string;
  applicantType: ApplicantType;
  status: ApplicationStatus;
  rewardAmount?: number;
  rewardCalculation?: RewardCalculation;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  employeeId?: string;
  department?: string;
  position?: string;
  role: 'user' | 'admin' | 'reviewer';
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
}

// AI Analysis Types
export interface AIAnalysisResult {
  paperType: PaperType;
  confidence: number;
  extractedFields: {
    title?: string;
    authors?: string[];
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    abstract?: string;
  };
  contentAnalysis: {
    hasHolisticCare: boolean;
    hasMedicalQuality: boolean;
    hasMedicalEducation: boolean;
    themes: string[];
  };
  journalInfo?: JournalInfo;
  suggestedReward?: RewardCalculation;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
