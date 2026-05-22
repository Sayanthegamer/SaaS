export default function DashboardLoading() {
  return (
    <div className="py-8 px-6 w-full max-w-5xl mx-auto flex flex-col gap-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-6 w-32 bg-zinc-800 rounded"></div>
        <div className="h-4 w-64 bg-zinc-900 rounded"></div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 rounded-xl overflow-hidden">
        <div className="bg-zinc-950 p-6 flex flex-col items-center gap-3">
          <div className="h-3 w-20 bg-zinc-900 rounded"></div>
          <div className="h-8 w-16 bg-zinc-800 rounded"></div>
        </div>
        <div className="bg-zinc-950 p-6 flex flex-col items-center gap-3">
          <div className="h-3 w-20 bg-zinc-900 rounded"></div>
          <div className="h-8 w-16 bg-zinc-800 rounded"></div>
        </div>
        <div className="bg-zinc-950 p-6 flex flex-col items-center gap-3">
          <div className="h-3 w-20 bg-zinc-900 rounded"></div>
          <div className="h-8 w-16 bg-zinc-800 rounded"></div>
        </div>
      </div>

      {/* Shimmer Area Skeleton */}
      <div className="border border-zinc-900 rounded-xl p-8 bg-zinc-900/10 flex flex-col gap-4 mt-4 h-64 justify-between">
        <div className="h-4 w-40 bg-zinc-800 rounded"></div>
        <div className="flex items-end justify-between gap-2 h-36">
          <div className="h-12 w-full bg-zinc-900/60 rounded"></div>
          <div className="h-24 w-full bg-zinc-900/60 rounded"></div>
          <div className="h-16 w-full bg-zinc-900/60 rounded"></div>
          <div className="h-32 w-full bg-zinc-900/60 rounded"></div>
          <div className="h-20 w-full bg-zinc-900/60 rounded"></div>
          <div className="h-28 w-full bg-zinc-900/60 rounded"></div>
          <div className="h-36 w-full bg-zinc-900/60 rounded"></div>
        </div>
      </div>
    </div>
  );
}
