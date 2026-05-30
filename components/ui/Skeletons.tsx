import React from 'react';

export function TopThreeSkeleton() {
  return (
    <div className="mb-12 w-full animate-pulse max-w-5xl mx-auto">
      <div className="h-4 w-48 bg-rally-surface rounded mx-auto mb-8"></div>
      <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-4 lg:gap-8 px-2 sm:px-0">
        {[2, 1, 3].map((pos) => (
          <div key={pos} className={`flex w-full sm:w-1/3 flex-col items-center rounded-lg bg-rally-surface p-6 shadow-sm border border-rally-bg ${pos === 1 ? 'sm:scale-105 sm:-translate-y-4' : ''}`}>
            <div className="h-8 w-8 rounded-md bg-rally-bg mb-6"></div>
            <div className="flex justify-center items-center gap-2 w-full mb-3">
              <div className="h-4 w-16 bg-rally-bg rounded"></div>
            </div>
            <div className="h-6 w-3/4 bg-rally-bg rounded mt-2"></div>
            <div className="h-4 w-1/2 bg-rally-bg rounded mt-3"></div>
            <div className="mt-6 h-12 w-full rounded-2xl bg-rally-bg border border-rally-surface"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="hidden md:flex items-center px-4 py-3 border-b border-rally-bg bg-rally-surface2/50 h-10">
      </div>
      <div className="flex flex-col gap-4 md:gap-0 mt-4 md:mt-0 pb-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center bg-rally-surface border-b border-rally-bg p-4 md:px-4 md:py-3 h-32 md:h-16 shadow-sm md:shadow-none">
            <div className="h-8 w-8 bg-rally-bg rounded-md mb-4 md:mb-0 md:mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-48 bg-rally-bg rounded"></div>
              <div className="h-4 w-24 bg-rally-surface2 rounded"></div>
            </div>
            <div className="mt-4 md:mt-0 space-y-2 flex flex-col items-end">
              <div className="h-5 w-20 bg-rally-bg rounded"></div>
              <div className="h-4 w-16 bg-rally-surface2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryTabsSkeleton() {
  return (
    <div className="w-full flex flex-col animate-pulse">
      {/* Buscador Skeleton */}
      <div className="w-full mb-6 h-12 bg-rally-surface border border-rally-bg rounded-xl"></div>
      
      {/* Tabs Skeleton */}
      <div className="w-full border-b border-rally-bg mb-8 overflow-hidden h-12">
        <div className="flex gap-2 sm:gap-6 px-2 sm:px-0">
          <div className="h-8 w-20 bg-rally-surface rounded"></div>
          <div className="h-8 w-16 bg-rally-surface rounded"></div>
          <div className="h-8 w-16 bg-rally-surface rounded"></div>
        </div>
      </div>
      <TopThreeSkeleton />
      <LeaderboardSkeleton />
    </div>
  );
}
