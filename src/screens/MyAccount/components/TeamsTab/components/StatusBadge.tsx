import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}