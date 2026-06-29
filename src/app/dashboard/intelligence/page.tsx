import Link from "next/link";
import { getCivicDashboardData } from "@/lib/actions/insightActions";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import visualizationStyles from "@/components/dashboard/VisualizationCSS.module.css";
import { Activity, AlertTriangle, ArrowRight, CheckCircle, ShieldAlert, Users } from "lucide-react";

interface GlobalMetrics {
  total: number;
  verified: number;
  pending: number;
  falseReports: number;
  avgResolutionHours: number;
  activeUsersToday: number;
}

interface Prediction {
  title: string;
  confidence: number;
  action: string;
  category: string;
}

interface ChartData {
  categoryBreakdown: Record<string, number>;
  timeline: number[];
}

interface DashboardData {
  globalMetrics: GlobalMetrics;
  predictions: Prediction[];
  aiSummary: string;
  charts: ChartData;
}

interface DashboardResponse {
  success: boolean;
  data?: DashboardData;
  error?: string;
}

export default async function CivicIntelligenceHub({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const params = await searchParams;
  const isDemo = params?.demo === "true";
  
  const dashboardReq: DashboardResponse = await getCivicDashboardData(isDemo);
  const data = dashboardReq.success ? dashboardReq.data : null;

  if (!data) return <div className={visualizationStyles.chartContainer} style={{padding:"2rem", color:"red"}}>Failed to load Civic Hub Core Services.</div>;

  const { globalMetrics, predictions, aiSummary, charts } = data;
  const categories = Object.keys(charts.categoryBreakdown);
  const maxCategoryVal = Math.max(...Object.values(charts.categoryBreakdown));

  return (
    <ErrorBoundary componentName="CivicIntelligencePage">
      <div className={visualizationStyles.chartContainer} style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily:"sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
        
        <div style={{ display: "flex", justifyContent:"space-between", alignItems:"center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", margin: "0 0 0.5rem 0", color: "#0f172a" }}>Civic Intelligence Hub</h1>
            <p style={{ margin: 0, color: "#64748b" }}>Unified analytics, gamification metrics, and predictive insights.</p>
          </div>
          <div>
            <Link href={isDemo ? "/dashboard/intelligence" : "?demo=true"}>
              <button style={{ padding: "0.5rem 1rem", background: isDemo ? "#ef4444" : "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                {isDemo ? "Exit Demo Mode" : "Activate Judging Demo Mode"}
              </button>
            </Link>
          </div>
        </div>

        {/* Global Metrics Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <MetricCard icon={<Activity color="#3b82f6"/>} title="Total Complaints" value={globalMetrics.total} />
          <MetricCard icon={<CheckCircle color="#10b981"/>} title="Community Verified" value={globalMetrics.verified} />
          <MetricCard icon={<ShieldAlert color="#ef4444"/>} title="False Flags" value={globalMetrics.falseReports} />
          <MetricCard icon={<Users color="#8b5cf6"/>} title="Active Users Today" value={globalMetrics.activeUsersToday} />
        </div>

        {/* AI & Predictive Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          
          {/* Predictive Engine */}
          <div className={visualizationStyles.chartContainer}>
            <h2 className={visualizationStyles.title}><AlertTriangle size={18} style={{verticalAlign:"bottom", marginRight:"8px", color:"#f59e0b"}}/> Predictive Insight Engine</h2>
            <div>
              {predictions.map((p: Prediction, i: number) => (
                <div key={i} style={{ padding: "1rem", borderLeft: "4px solid #f59e0b", background:"#fffbeb", marginBottom:"1rem", borderRadius:"4px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <strong>{p.title}</strong>
                    <span style={{ fontSize:"0.8rem", background:"#f59e0b", color:"white", padding:"2px 8px", borderRadius:"12px" }}>{p.confidence}% Conf.</span>
                  </div>
                  <p style={{ margin:"0.5rem 0", fontSize:"0.9rem", color:"#475569" }}>Tag: {p.category}</p>
                  <div style={{ fontSize:"0.9rem", fontWeight:600, color:"#b45309" }}><ArrowRight size={14} style={{verticalAlign:"middle"}}/> Action: {p.action}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={visualizationStyles.chartContainer} style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "white" }}>
            <h2 className={visualizationStyles.title} style={{ color:"white" }}>✨ AI Civic Summary</h2>
            <p style={{ lineHeight:"1.6", fontSize:"1.1rem", opacity:0.9 }}>
              {aiSummary}
            </p>
          </div>
        </div>

        {/* Visualizations Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Bar Chart Categories */}
          <div className={visualizationStyles.chartContainer}>
            <h2 className={visualizationStyles.title}>Category Stress Levels</h2>
            <div className={visualizationStyles.barAxis}>
              {categories.map((cat: string) => {
                const val = charts.categoryBreakdown[cat];
                const heightPercent = (val / maxCategoryVal) * 100;
                return (
                  <div key={cat} className={visualizationStyles.barGroup}>
                    <span className={visualizationStyles.barLabel} style={{fontSize:"0.75rem", marginBottom:"4px", fontWeight:"bold"}}>{val}</span>
                    <div className={visualizationStyles.bar} style={{ height: `${heightPercent}%`, background: cat === "Sanitation" ? "#ef4444" : "#3b82f6" }}></div>
                    <span className={visualizationStyles.barLabel}>{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={visualizationStyles.chartContainer}>
            <h2 className={visualizationStyles.title}>Top Citizen Leaderboard Highlights</h2>
            <p style={{fontSize:"0.9rem", color:"#64748b"}}>Quick glimpse of our Civic Trust leaderboards and XP progression.</p>
            <div style={{ padding:"1rem", border:"1px solid #e2e8f0", borderRadius:"4px", marginBottom:"1rem" }}>
              <div style={{display:"flex", justifyContent:"space-between", fontWeight:"bold"}}>
                <span>Citizen Leader: VK-2026-XQZ5</span>
                <span>Trust Score: 4,500</span>
              </div>
              <div className={visualizationStyles.xpBarContainer}>
                <div className={visualizationStyles.xpBarFill} style={{ width: "85%" }}></div>
              </div>
            </div>
            <Link href="/leaderboard" style={{ color: "#3b82f6", textDecoration:"none", fontWeight:600, fontSize:"0.9rem" }}>View Full Leaderboard System →</Link>
          </div>
        </div>

      </div>
    </ErrorBoundary>
  );
}

function MetricCard({title, value, icon}: {title: string, value: number, icon: React.ReactNode}) {
  return (
    <div style={{ background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display:"flex", alignItems:"center", gap:"1rem" }}>
      <div style={{ padding:"1rem", background:"#f1f5f9", borderRadius:"50%" }}>{icon}</div>
      <div>
        <p style={{ margin:0, fontSize:"0.85rem", color:"#64748b", textTransform:"uppercase", fontWeight:"bold" }}>{title}</p>
        <h3 style={{ margin:"0.25rem 0 0 0", fontSize:"1.8rem", color:"#0f172a" }}>{value.toLocaleString()}</h3>
      </div>
    </div>
  )
}