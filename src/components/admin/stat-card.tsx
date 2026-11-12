import React from "react";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger" | "info";
};

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const variantStyles = {
    default: "bg-white text-stone-900 border-stone-200",
    success: "bg-emerald-50/50 text-emerald-950 border-emerald-200",
    warning: "bg-amber-50/60 text-amber-950 border-amber-200",
    danger: "bg-rose-50/60 text-rose-950 border-rose-200",
    info: "bg-blue-50/60 text-blue-950 border-blue-200",
  };

  const iconStyles = {
    default: "bg-stone-100 text-stone-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`admin-stat-card ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-stone-900">{value}</p>
          {subtext && <p className="text-xs text-stone-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
