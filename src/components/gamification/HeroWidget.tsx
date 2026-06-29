import { Trophy, TrendingUp } from "lucide-react";

interface HeroWidgetProps {
  userName: string;
  points: number;
  rank: number;
  nextBadge?: {
    name: string;
    pointsRequired: number;
    icon: string;
  } | null;
}

export default function HeroWidget({ userName, points, rank, nextBadge }: HeroWidgetProps) {
  const progress = nextBadge
    ? Math.min(100, (points / nextBadge.pointsRequired) * 100)
    : 100;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Trophy size={80} className="text-indigo-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
            #{rank} Rank
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{userName}</h3>
            <p className="text-xs text-slate-400 font-semibold">Community Hero Status</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-4xl font-extrabold text-white mb-1">{points}</div>
          <div className="text-xs uppercase tracking-wider font-bold text-slate-500">Total Points</div>
        </div>

        {nextBadge && (
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-end mb-2 text-sm font-semibold">
              <span className="text-slate-400">Next: <strong className="text-slate-200">{nextBadge.name}</strong></span>
              <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <TrendingUp size={14} className="text-indigo-400" />
              {nextBadge.pointsRequired - points} points to go
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
