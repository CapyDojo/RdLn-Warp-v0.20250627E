import React from 'react';

export const Loader = () => React.createElement('div', null, 'Loading...');
export const ChevronDown = () => React.createElement('div', null, '\u25BC');
export const AlertCircle = () => React.createElement('div', null, '\u26A0');

export const Sparkles = ({ className }: { className?: string }) =>
  React.createElement(
    'span',
    {
      className: className,
      role: 'img',
      'aria-label': 'sparkles',
    },
    '✨'
  );
