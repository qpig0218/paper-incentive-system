import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Calendar,
  ExternalLink,
  Award,
  BookOpen,
  Microscope,
  MessageSquare,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { Paper, PaperType, ApplicationStatus } from '../types';

interface PaperCardProps {
  paper: Paper;
  onClick?: () => void;
  showReward?: boolean;
  rewardAmount?: number;
  applicationStatus?: ApplicationStatus;
  submittedAt?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: {
    label: '審核中',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: Clock,
  },
  approved: {
    label: '已核准',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    icon: CheckCircle,
  },
  rejected: {
    label: '已退件',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
  revision: {
    label: '需修改',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: AlertCircle,
  },
};

const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  onClick,
  showReward = false,
  rewardAmount,
  applicationStatus,
  submittedAt: _submittedAt,
}) => {
  const getPaperTypeInfo = (type: PaperType) => {
    const types: Record<PaperType, { label: string; icon: React.ElementType; color: string }> = {
      original: { label: '原著論文', icon: Microscope, color: 'from-blue-500 to-cyan-500' },
      case_report: { label: '病例報告', icon: FileText, color: 'from-emerald-500 to-teal-500' },
      review: { label: '綜說文章', icon: BookOpen, color: 'from-purple-500 to-violet-500' },
      letter: { label: 'Letter', icon: MessageSquare, color: 'from-amber-500 to-orange-500' },
      note: { label: 'Note', icon: FileText, color: 'from-slate-500 to-gray-500' },
      communication: { label: 'Communication', icon: MessageSquare, color: 'from-pink-500 to-rose-500' },
      image: { label: 'Image', icon: ImageIcon, color: 'from-indigo-500 to-blue-500' },
      abstract_poster: { label: '海報發表', icon: FileText, color: 'from-teal-500 to-green-500' },
      abstract_oral: { label: '口頭報告', icon: MessageSquare, color: 'from-orange-500 to-red-500' },
      comment: { label: 'Comment', icon: MessageSquare, color: 'from-gray-500 to-slate-500' },
      book_chapter: { label: '書籍章節', icon: BookOpen, color: 'from-amber-600 to-yellow-500' },
      translation: { label: '翻譯書籍', icon: BookOpen, color: 'from-cyan-500 to-blue-500' },
    };
    return types[type] || types.original;
  };

  const typeInfo = getPaperTypeInfo(paper.paperType);
  const TypeIcon = typeInfo.icon;

  const formatAuthors = (authors: Paper['authors']) => {
    if (authors.length === 0) return '作者不詳';
    if (authors.length <= 3) {
      return authors.map((a) => a.name).join(', ');
    }
    return `${authors[0].name} 等 ${authors.length} 位作者`;
  };

  const getImpactFactorBadge = () => {
    const if_ = paper.journalInfo?.impactFactor;
    if (!if_) return null;

    let badgeClass = 'reward-badge-bronze';
    if (if_ >= 5) badgeClass = 'reward-badge-gold';
    else if (if_ >= 2) badgeClass = 'reward-badge-silver';

    return (
      <span className={badgeClass}>
        IF: {if_.toFixed(2)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="paper-card group"
      onClick={onClick}
    >
      {/* Thumbnail or gradient placeholder */}
      <div className="relative h-32 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
        {paper.thumbnailUrl ? (
          <img
            src={paper.thumbnailUrl}
            alt={paper.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${typeInfo.color} opacity-80`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <TypeIcon className="w-16 h-16 text-white/30" />
            </div>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${typeInfo.color} shadow-lg`}>
            <TypeIcon className="w-3 h-3" />
            {typeInfo.label}
          </span>
        </div>

        {/* Impact Factor badge */}
        {paper.journalInfo?.impactFactor && (
          <div className="absolute top-3 right-3">
            {getImpactFactorBadge()}
          </div>
        )}

        {/* Application Status badge */}
        {applicationStatus && (
          <div className="absolute bottom-3 right-3">
            {(() => {
              const status = statusConfig[applicationStatus];
              const StatusIcon = status.icon;
              return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                  <StatusIcon className="w-3 h-3" strokeWidth={2} />
                  {status.label}
                </span>
              );
            })()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {paper.title}
        </h3>

        {/* Chinese title if exists */}
        {paper.titleChinese && (
          <p className="text-sm text-slate-700 line-clamp-1">
            {paper.titleChinese}
          </p>
        )}

        {/* Authors */}
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Users className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{formatAuthors(paper.authors)}</span>
        </div>

        {/* Journal / Conference */}
        {paper.journalInfo && (
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {paper.journalInfo.name}
              {paper.volume && ` ${paper.volume}`}
              {paper.issue && `(${paper.issue})`}
              {paper.pages && `: ${paper.pages}`}
            </span>
          </div>
        )}

        {paper.conferenceInfo && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{paper.conferenceInfo.name}</span>
          </div>
        )}

        {/* Date */}
        {paper.publicationDate && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(paper.publicationDate).toLocaleDateString('zh-TW')}</span>
          </div>
        )}

        {/* Reward */}
        {showReward && rewardAmount !== undefined && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">獎勵金額</span>
              <span className="flex items-center gap-1 font-bold text-lg text-emerald-600">
                <Award className="w-5 h-5" />
                NT$ {rewardAmount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* DOI link */}
        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            DOI: {paper.doi}
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default PaperCard;
