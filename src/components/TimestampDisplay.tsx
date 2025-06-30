import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface TimestampDisplayProps {
  timestamp: string;
  label?: string;
  showRelative?: boolean;
  showFull?: boolean;
  className?: string;
}

const TimestampDisplay: React.FC<TimestampDisplayProps> = ({
  timestamp,
  label = "Recorded",
  showRelative = true,
  showFull = false,
  className = ""
}) => {
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    // Relative time
    const getRelativeTime = () => {
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
      return `${Math.floor(diffInMinutes / 10080)}w ago`;
    };

    // Full formatted time
    const getFullTime = () => {
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    };

    // Date only
    const getDateOnly = () => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // Time only
    const getTimeOnly = () => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    return {
      relative: getRelativeTime(),
      full: getFullTime(),
      date: getDateOnly(),
      time: getTimeOnly(),
      iso: date.toISOString()
    };
  };

  const formatted = formatTimestamp(timestamp);

  if (showFull) {
    return (
      <div className={`flex flex-col space-y-1 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{label}:</span>
        </div>
        <div className="text-white font-mono text-sm">
          <div>{formatted.date}</div>
          <div className="text-blue-300">{formatted.time}</div>
        </div>
        {showRelative && (
          <div className="text-gray-500 text-xs">({formatted.relative})</div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="w-4 h-4 text-gray-400" />
      <div className="text-sm">
        <span className="text-gray-400">{label}: </span>
        <span className="text-white font-mono">{formatted.date}</span>
        {showRelative && (
          <span className="text-gray-500 ml-2">({formatted.relative})</span>
        )}
      </div>
    </div>
  );
};

export default TimestampDisplay;