import type { RewardCalculation, PaperType, AuthorRole, RewardBonus, RewardDeduction } from '../types/index.js';

interface RewardInput {
  paperType: PaperType;
  journalType: 'sci' | 'ssci' | 'non_sci';
  impactFactor?: number;
  authorRole: AuthorRole;
  hasHolisticCare: boolean;
  hasMedicalQuality: boolean;
  hasMedicalEducation: boolean;
  journalName: string;
  isChimeiFirstAuthor?: boolean;
}

// Base reward amounts based on Chi Mei's rules
const BASE_REWARDS = {
  // SCI/SSCI 原著論文
  sci_original: {
    base: 60000, // IF < 2
    if2: 70000,  // IF >= 2
    if3: 80000,  // IF >= 3
    if4: 90000,  // IF >= 4
    if5: 100000, // IF >= 5
    q1_10percent: 120000, // Top 10% in Q1
  },
  // SCI/SSCI 病例報告
  sci_case_report: 25000,
  // SCI/SSCI Review
  sci_review: 40000,
  // SCI/SSCI Letter/Note/Communication/Comment
  sci_letter: 15000,
  // SCI/SSCI Image
  sci_image: 8000,

  // 非 SCI/SSCI
  non_sci_original: 15000,
  non_sci_case_report: 10000,
  non_sci_review: 12000,
  non_sci_letter: 5000,

  // 學會發表
  abstract_oral_international: 10000,
  abstract_poster_international: 5000,
  abstract_oral_domestic: 3000,
  abstract_poster_domestic: 2000,

  // 書籍
  book_chapter: 8000,
  translation: 5000,
};

// Author role multipliers
const AUTHOR_MULTIPLIERS: Record<AuthorRole, number> = {
  first: 1.0,           // 100%
  corresponding: 1.0,   // 100%
  co_first: 1.0,        // 100%
  co_corresponding: 1.0, // 100%
  second: 0.5,          // 50%
  third_to_sixth: 0.2,  // 20%
};

// Special journal bonuses
const JOURNAL_BONUSES: Record<string, { percentage: number; description: string }> = {
  '醫療品質雜誌': { percentage: 50, description: '刊登於「醫療品質」雜誌加成' },
  '醫學教育': { percentage: 100, description: '刊登於「醫學教育」雜誌加成' },
};

export function calculateReward(input: RewardInput): RewardCalculation {
  let baseAmount = 0;
  const bonuses: RewardBonus[] = [];
  const deductions: RewardDeduction[] = [];

  // Calculate base amount based on paper type and journal type
  if (input.journalType === 'sci' || input.journalType === 'ssci') {
    switch (input.paperType) {
      case 'original':
        if (input.impactFactor && input.impactFactor >= 5) {
          baseAmount = BASE_REWARDS.sci_original.if5;
        } else if (input.impactFactor && input.impactFactor >= 4) {
          baseAmount = BASE_REWARDS.sci_original.if4;
        } else if (input.impactFactor && input.impactFactor >= 3) {
          baseAmount = BASE_REWARDS.sci_original.if3;
        } else if (input.impactFactor && input.impactFactor >= 2) {
          baseAmount = BASE_REWARDS.sci_original.if2;
        } else {
          baseAmount = BASE_REWARDS.sci_original.base;
        }
        break;
      case 'case_report':
        baseAmount = BASE_REWARDS.sci_case_report;
        break;
      case 'review':
        baseAmount = BASE_REWARDS.sci_review;
        break;
      case 'letter':
      case 'note':
      case 'communication':
      case 'comment':
        baseAmount = BASE_REWARDS.sci_letter;
        break;
      case 'image':
        baseAmount = BASE_REWARDS.sci_image;
        break;
      default:
        baseAmount = BASE_REWARDS.sci_original.base;
    }
  } else {
    // Non-SCI/SSCI
    switch (input.paperType) {
      case 'original':
        baseAmount = BASE_REWARDS.non_sci_original;
        break;
      case 'case_report':
        baseAmount = BASE_REWARDS.non_sci_case_report;
        break;
      case 'review':
        baseAmount = BASE_REWARDS.non_sci_review;
        break;
      case 'letter':
      case 'note':
      case 'communication':
      case 'comment':
        baseAmount = BASE_REWARDS.non_sci_letter;
        break;
      case 'abstract_oral':
        baseAmount = BASE_REWARDS.abstract_oral_domestic;
        break;
      case 'abstract_poster':
        baseAmount = BASE_REWARDS.abstract_poster_domestic;
        break;
      case 'book_chapter':
        baseAmount = BASE_REWARDS.book_chapter;
        break;
      case 'translation':
        baseAmount = BASE_REWARDS.translation;
        break;
      default:
        baseAmount = BASE_REWARDS.non_sci_original;
    }
  }

  // Apply Impact Factor bonuses for SCI papers
  if ((input.journalType === 'sci' || input.journalType === 'ssci') && input.impactFactor) {
    if (input.impactFactor >= 10) {
      bonuses.push({
        type: 'highImpact',
        description: 'IF ≧ 10 高影響力期刊加成',
        percentage: 50,
        amount: Math.round(baseAmount * 0.5),
      });
    } else if (input.impactFactor >= 5) {
      bonuses.push({
        type: 'highImpact',
        description: 'IF ≧ 5 影響力加成',
        percentage: 25,
        amount: Math.round(baseAmount * 0.25),
      });
    }
  }

  // Apply special journal bonuses
  const normalizedJournalName = input.journalName.trim();
  const journalBonus = JOURNAL_BONUSES[normalizedJournalName];
  if (journalBonus) {
    bonuses.push({
      type: 'journalBonus',
      description: journalBonus.description,
      percentage: journalBonus.percentage,
      amount: Math.round(baseAmount * (journalBonus.percentage / 100)),
    });
  }

  // Apply theme bonuses
  if (input.hasHolisticCare) {
    bonuses.push({
      type: 'holisticCare',
      description: '全人照護主題加成',
      percentage: 20,
      amount: Math.round(baseAmount * 0.2),
    });
  }

  if (input.hasMedicalQuality) {
    bonuses.push({
      type: 'medicalQuality',
      description: '醫品病安主題加成',
      percentage: 20,
      amount: Math.round(baseAmount * 0.2),
    });
  }

  if (input.hasMedicalEducation) {
    bonuses.push({
      type: 'medicalEducation',
      description: '醫學教育主題加成',
      percentage: 20,
      amount: Math.round(baseAmount * 0.2),
    });
  }

  // Calculate subtotal before author multiplier
  const bonusTotal = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const deductionTotal = deductions.reduce((sum, d) => sum + d.amount, 0);
  const subtotal = baseAmount + bonusTotal - deductionTotal;

  // Apply author role multiplier
  const multiplier = AUTHOR_MULTIPLIERS[input.authorRole] || 1.0;
  const totalAmount = Math.round(subtotal * multiplier);

  // Generate formula string
  let formula = `基本獎勵 NT$${baseAmount.toLocaleString()}`;
  bonuses.forEach((b) => {
    formula += ` + ${b.description} NT$${b.amount.toLocaleString()}`;
  });
  deductions.forEach((d) => {
    formula += ` - ${d.description} NT$${d.amount.toLocaleString()}`;
  });
  if (multiplier !== 1.0) {
    formula += ` × ${input.authorRole === 'second' ? '第二作者 50%' : '第三至六作者 20%'}`;
  }
  formula += ` = NT$${totalAmount.toLocaleString()}`;

  return {
    baseAmount,
    bonuses,
    deductions,
    totalAmount,
    formula,
  };
}

// Get reward table for display
export function getRewardTable() {
  return {
    sci: {
      original: {
        base: 60000,
        if2: 70000,
        if3: 80000,
        if4: 90000,
        if5: 100000,
        q1_10: 120000,
      },
      caseReport: 25000,
      review: 40000,
      letter: 15000,
      image: 8000,
    },
    nonSci: {
      original: 15000,
      caseReport: 10000,
      review: 12000,
      letter: 5000,
    },
    conference: {
      internationalOral: 10000,
      internationalPoster: 5000,
      domesticOral: 3000,
      domesticPoster: 2000,
    },
    book: {
      chapter: 8000,
      translation: 5000,
    },
    authorMultipliers: {
      firstOrCorresponding: '100%',
      second: '50%',
      thirdToSixth: '20%',
    },
    specialBonuses: {
      medicalQuality: '+50%',
      medicalEducation: '+100%',
    },
  };
}
