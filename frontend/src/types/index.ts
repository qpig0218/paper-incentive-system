// Paper types
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

export type JournalType = 'sci' | 'ssci' | 'non_sci' | 'education' | 'quality';

export type ConferenceLevel = 'international' | 'national';

export type PresentationType = 'poster' | 'oral';

export type AuthorRole = 'first' | 'corresponding' | 'co_first' | 'co_corresponding' | 'other';

export type ApplicantType = 'attending_physician' | 'medical_staff' | 'administrative';

export type ApplicationStatus = 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid';

export interface Author {
  id: string;
  name: string;
  employeeId?: string;
  affiliation: string;
  isCorresponding: boolean;
  isFirst: boolean;
  order: number;
}

export interface JournalInfo {
  name: string;
  issn?: string;
  isSci: boolean;
  isSsci: boolean;
  impactFactor?: number;
  jcrYear?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  ranking?: number;
  totalInField?: number;
}

export interface ConferenceInfo {
  name: string;
  level: ConferenceLevel;
  location: string;
  date: string;
  presentationType: PresentationType;
}

export interface Paper {
  id: string;
  title: string;
  titleChinese?: string;
  abstract?: string;
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
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardCalculation {
  baseAmount: number;
  bonuses: {
    type: string;
    description: string;
    percentage: number;
    amount: number;
  }[];
  deductions: {
    type: string;
    description: string;
    percentage: number;
    amount: number;
  }[];
  totalAmount: number;
  formula: string;
}

export interface PaperApplication {
  id: string;
  paperId: string;
  paper: Paper;
  applicantId: string;
  applicantName: string;
  applicantType: ApplicantType;
  authorRole: AuthorRole;
  status: ApplicationStatus;
  rewardCalculation?: RewardCalculation;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerRecord {
  id: string;
  userId: string;
  year: number;
  papers: Paper[];
  totalReward: number;
  sciPaperCount: number;
  nonSciPaperCount: number;
  conferenceCount: number;
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
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  userType: ApplicantType;
  avatar?: string;
}

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
    keywords?: string[];
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

export interface DashboardStats {
  totalPapers: number;
  pendingApplications: number;
  approvedThisMonth: number;
  totalRewardThisYear: number;
  sciPaperCount: number;
  topAuthors: { name: string; count: number }[];
}
