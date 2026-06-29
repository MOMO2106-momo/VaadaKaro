export const dynamic = "force-dynamic";
import styles from "./leaderboard.module.css";
import { getLeaderboardData, getCommunityStats } from "@/lib/actions/leaderboardActions";
import { auth } from "@/auth";
import Link from "next/link";
import { Trophy, Users, Star, Medal, ArrowUpRight } from "lucide-react";

export default async function LeaderboardPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const [leaderboardResult, communityStatsResult] = await Promise.all([
    getLeaderboardData(),
    getCommunityStats()
  ]);

  if (!leaderboardResult.success || !communityStatsResult.success) {
    return <div>Error loading leaderboard.</div>;
  }

  const users = leaderboardResult.users || [];
  const topThree = users.slice(0, 3);
  const others = users.slice(3);
  const communityStats = communityStatsResult.stats;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Citizen Leaderboard</h1>
          <p className={styles.subtitle}>Celebrating the most active contributors in our hyperlocal community.</p>
        </div>
        <div className={styles.communityStats}>
          <div className={styles.statItem}>
            <Star color="#ca8a04" size={16} />
            <strong>{communityStats?.totalPoints.toLocaleString()}</strong>
            <span>Total Points</span>
          </div>
          <div className={styles.statItem}>
            <Users color="#1e3a8a" size={16} />
            <strong>{communityStats?.activeCitizens}</strong>
            <span>Active Citizens</span>
          </div>
        </div>
      </header>

      <div className={styles.podium}>
        {topThree.map((user: any, index: number) => (
          <div key={user.id} className={`${styles.podiumCard} ${styles[`rank${index + 1}`]}`}>
            <div className={styles.avatarLarge}>
              {user.image ? <img src={user.image} alt={user.name || ""} /> : <Medal size={40} />}
              <div className={styles.badgeCount}>{user._count.userBadges}</div>
            </div>
            <h3 className={styles.userName}>{user.name || "Anonymous Citizen"}</h3>
            <div className={styles.userPoints}>{user.trustScore} Trust</div>
            <div className={styles.medalIcon}>
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Citizen ID</th>
              <th>Reporting</th>
              <th>Verification</th>
              <th>Badges</th>
              <th>Trust Score</th>
            </tr>
          </thead>
          <tbody>
            {others.map((user: any, index: number) => {
              const actualRank = index + 4;
              const isCurrentUser = user.id === currentUserId;
              return (
                <tr key={user.id} className={isCurrentUser ? styles.currentUser : ""}>
                  <td className={styles.rankCell}>#{actualRank}</td>
                  <td className={styles.userCell}>
                    <div className={styles.avatarSmall}>
                      {user.image ? <img src={user.image} alt="" /> : <Users size={16} />}
                    </div>
                    {user.citizenId || "Anonymous"} 
                    {isCurrentUser && <span className={styles.meTag}>(You)</span>}
                  </td>
                  <td>{user._count.complaints} Reports</td>
                  <td>{user._count.votes} Votes</td>
                  <td>{user._count.userBadges} Badges</td>
                  <td className={styles.pointsCell}>{user.trustScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className={styles.cta}>
        <p>Want to climb the ranks? Help your community by reporting issues and verifying grievances.</p>
        <Link href="/file-complaint" className={styles.ctaBtn}>
          Start Contributing <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}
