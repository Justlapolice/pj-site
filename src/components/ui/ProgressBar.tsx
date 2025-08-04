import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  color = 'bg-blue-500',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / Math.max(1, max)) * 100));
  
  return (
    <div className={`w-full bg-gray-700 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
};

export default ProgressBar;
