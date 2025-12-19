import React from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  iconSrc?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, iconSrc }) => {
  return (
    <div className="card">
      <p className="label">
        {iconSrc && <img src={iconSrc} alt="" />} {label}
      </p>
      <h1>{value}</h1>
    </div>
  );
};

export default StatCard;

