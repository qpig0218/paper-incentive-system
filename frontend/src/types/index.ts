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

export type AuthorRole = 'first' | 'corresponding' | 'co_first' | 'co_corresponding' | 'second' | 'third_to_sixth' | 'other';

export type ApplicantType = 'first_author' | 'corresponding' | 'co_author';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'revision';

// Multi-level approval workflow types
export type ApprovalLevel = 'reviewer' | 'supervisor' | 'director';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'returned';

export interface ApprovalStep {
  id: string;
  applicationId: string;
  level: ApprovalLevel;
  status: ApprovalStatus;
  approverId?: string;
  approverName?: string;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApplicationWithWorkflow extends PaperApplication {
  paper: Paper;
  applicantName: string;
  applicantDepartment: string;
  currentApprovalLevel: ApprovalLevel;
  approvalSteps: ApprovalStep[];
  verificationChecklist?: VerificationChecklist;
}

export interface VerificationChecklist {
  paperInfoCorrect: boolean;
  authorInfoCorrect: boolean;
  journalInfoCorrect: boolean;
  impactFactorVerified: boolean;
  rewardCalculationCorrect: boolean;
  documentsComplete: boolean;
  notes?: string;
}

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
