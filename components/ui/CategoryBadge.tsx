import React from 'react';

const CATEGORY_STYLES: Record<string, string> = {
  "Rally 2 / R5": "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-600/20",
  "N5 Prototipos": "bg-indigo-50 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 ring-1 ring-indigo-600/20",
  "RC3": "bg-violet-50 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 ring-1 ring-violet-600/20",
  "RC4": "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-600/20",
  "RC5": "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 ring-1 ring-emerald-600/20",
  "RC2N": "bg-cyan-50 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 ring-1 ring-cyan-600/20",
  "T4": "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 ring-1 ring-yellow-600/20",
  "T3": "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ring-1 ring-amber-600/20",
  "T1": "bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 ring-1 ring-orange-600/20",
  "TODO TERRENO": "bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 ring-1 ring-rose-600/20",
  "UTV-R": "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-1 ring-red-600/20",
  "UTV-T": "bg-pink-50 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 ring-1 ring-pink-600/20",
  "CAMIONETAS": "bg-stone-50 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300 ring-1 ring-stone-600/20",
  "SIN CLASIFICAR": "bg-rally-muted/10 text-rally-muted ring-1 ring-rally-muted/20"
};

interface CategoryBadgeProps {
  cat: string;
  className?: string;
}

export const CategoryBadge = ({ cat, className = "" }: CategoryBadgeProps) => {
  const style = CATEGORY_STYLES[cat] ?? "bg-rally-muted/10 text-rally-muted ring-1 ring-rally-muted/20";
  
  return (
    <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest ${style} ${className}`}>
      {cat}
    </span>
  );
};
