import { Award, Lock } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
}

interface UserBadge {
  badgeId: string;
  earnedAt: Date;
}

interface BadgeShowcaseProps {
  allBadges: Badge[];
  userBadges: UserBadge[];
}

export default function BadgeShowcase({ allBadges, userBadges }: BadgeShowcaseProps) {
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <Award size={18} className="text-amber-400" /> Badges Showcase
      </h3>
      <div className="flex flex-col gap-3">
        {allBadges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex items-start gap-4 p-4 rounded-xl border ${isEarned ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/50 border-slate-800/60 opacity-60'}`}
              title={badge.description}
            >
              <div className="text-3xl shrink-0">{badge.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-1">
                    {badge.name} {!isEarned && <Lock size={12} className="text-slate-500" />}
                  </div>
                  {isEarned && <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Award size={10} /> Earned</div>}
                </div>
                <div className="text-xs font-semibold text-slate-400">{badge.pointsRequired} Points Required</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
