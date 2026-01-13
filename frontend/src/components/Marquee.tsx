import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { Announcement } from '../types';

interface MarqueeProps {
  announcements: Announcement[];
}

const Marquee: React.FC<MarqueeProps> = ({ announcements }) => {
  if (announcements.length === 0) return null;

  const getIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeStyles = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500';
      case 'success':
        return 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500';
      default:
        return 'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500';
    }
  };

  // Sort by priority: urgent first
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const priority = { urgent: 0, warning: 1, info: 2, success: 3 };
    return priority[a.type] - priority[b.type];
  });

  const marqueeContent = sortedAnnouncements.map((a) => (
    <span key={a.id} className="inline-flex items-center gap-2 mx-8">
      {getIcon(a.type)}
      <span className="font-medium">{a.title}：</span>
      <span>{a.content}</span>
    </span>
  ));

  return (
    <div className={`${getTypeStyles(sortedAnnouncements[0].type)} text-white py-3 shadow-lg relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative flex items-center">
        {/* Static icon */}
        <div className="flex-shrink-0 px-4 border-r border-white/20">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {marqueeContent}
            {marqueeContent} {/* Duplicate for seamless loop */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
