export default function RootLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Double-ring spinning portal */}
        <div className="w-12 h-12 rounded-full border border-zinc-900 border-t-zinc-400 animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full border border-zinc-900 border-b-zinc-500 animate-spin [animation-direction:reverse]"></div>
      </div>
      <p className="text-xs font-mono text-zinc-550 uppercase tracking-widest animate-pulse">Loading LLMify</p>
    </div>
  );
}
