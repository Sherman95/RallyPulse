import React from 'react';

const CATEGORY_STYLES: Record<string, string> = {
  'Rally 2 / R5': 'bg-blue-50    text-blue-800   dark:bg-blue-900/25   dark:text-blue-300',
  'N5 Prototipos':'bg-purple-50  text-purple-800 dark:bg-purple-900/25 dark:text-purple-300',
  'RC3':          'bg-sky-50     text-sky-800    dark:bg-sky-900/25    dark:text-sky-300',
  'RC4':          'bg-green-50   text-green-800  dark:bg-green-900/25  dark:text-green-300',
  'RC5':          'bg-amber-50   text-amber-800  dark:bg-amber-900/25  dark:text-amber-300',
  'RC2N':         'bg-teal-50    text-teal-800   dark:bg-teal-900/25   dark:text-teal-300',
  'T4':           'bg-orange-50  text-orange-800 dark:bg-orange-900/25 dark:text-orange-300',
  'T3':           'bg-rose-50    text-rose-800   dark:bg-rose-900/25   dark:text-rose-300',
  'T1':           'bg-red-50     text-red-800    dark:bg-red-900/25    dark:text-red-300',
  'TODO TERRENO': 'bg-lime-50    text-lime-800   dark:bg-lime-900/25   dark:text-lime-300',
  'UTV-R':        'bg-red-50     text-red-800    dark:bg-red-900/25    dark:text-red-300',
  'UTV-T':        'bg-orange-50  text-orange-800 dark:bg-orange-900/25 dark:text-orange-300',
  'CAMIONETAS':   'bg-violet-50  text-violet-800 dark:bg-violet-900/25 dark:text-violet-300',
  'SIN CLASIFICAR': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
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
