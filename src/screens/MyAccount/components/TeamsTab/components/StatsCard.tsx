import { ReactNode } from 'react';

interface StatsCardProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
}

export function StatsCard({ value, label, icon, bgColor, textColor }: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 flex items-center justify-between`}>
      <div>
        <div className={`text-2xl font-bold ${textColor} mb-1`}>{value}</div>
        <div className="text-[#6F6F6F]">{label}</div>
      </div>
      {icon}
    </div>
  );
}