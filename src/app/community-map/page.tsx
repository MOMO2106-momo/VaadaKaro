"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getMapComplaints, getUserMapComplaints } from "@/lib/actions/mapActions";
import { getAICommunityInsights } from "@/lib/actions/insightActions";
import styles from "./community-map.module.css";
import { Check, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoShield } from "@/components/ui/ErrorBoundary";
import SpinnerGuard from "@/components/ui/SpinnerGuard";

const MapView = dynamic(() => import("@/components/community-map/map-view"), {
  loading: () => <div className={styles.mapLoading}>Initializing Interactive Map...</div>,
  ssr: false,
});

const MyComplaintsPanel = dynamic(() => import("@/components/community-map/MyComplaintsPanel"), {
  ssr: false,
});

const DEMO_DATA = {
  complaints: [
    { id: "d1", title: "Broken Streetlight", category: "Infrastructure", status: "SUBMITTED", latitude: 28.6139, longitude: 77.2090, verifiedScore: 12, flagCount: 0, trackingId: "d1000001", description: "Streetlight near sector 5 has been broken for weeks.", location: "Sector 5, Noida" },
    { id: "d2", title: "Overflowing Drain", category: "Sanitation", status: "IN_PROGRESS", latitude: 28.6200, longitude: 77.2150, verifiedScore: 8, flagCount: 0, trackingId: "d1000002", description: "Main drain overflowing during monsoon season.", location: "Lajpat Nagar" },
    { id: "d3", title: "Water Supply Failure", category: "Water", status: "SUBMITTED", latitude: 28.6100, longitude: 77.2050, verifiedScore: 20, flagCount: 0, trackingId: "d1000003", description: "No water supply for 3 days in the colony.", location: "R.K. Puram" },
    { id: "d4", title: "Deep Pothole on Main Road", category: "Roads", status: "UNDER_REVIEW", latitude: 28.6165, longitude: 77.2120, verifiedScore: 15, flagCount: 0, trackingId: "d1000004", description: "Large pothole causing accidents on the main road.", location: "Connaught Place" },
    { id: "d5", title: "Garbage Not Collected", category: "Sanitation", status: "SUBMITTED", latitude: 28.6080, longitude: 77.2200, verifiedScore: 6, flagCount: 0, trackingId: "d1000005", description: "Garbage not collected for over a week.", location: "Sarojini Nagar" },
  ],
  stats: { open: 380, resolved: 142, verifications: 1240 },
  hotspots: [
    { id: "h1", latitude: 28.6139, longitude: 77.2090, count: 15, category: "Infrastructure", priority: "URGENT" },
    { id: "h2", latitude: 28.6080, longitude: 77.2200, count: 8, category: "Sanitation", priority: "HIGH" },
  ],
};

const CATEGORIES = ['Road', 'Sanitation', 'Status', 'Others'];

export default function CommunityMapPage() {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Road']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // My Complaints panel state
  const [myComplaints, setMyComplaints] = useState<any[]>([]);
  const [myComplaintsLoading, setMyComplaintsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  const [data, setData] = useState<{
    complaints: any[];
    promises: any[];
    stats: any;
    hotspots: any[];
    loading: boolean;
    error: string | null;
    isDemo: boolean;
  }>({
    complaints: [],
    promises: [],
    stats: { open: 0, resolved: 0, verifications: 0 },
    hotspots: [],
    loading: true,
    error: null,
    isDemo: false
  });

  const toggleFilter = (cat: string) => {
    setActiveFilters(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Load map data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isDemo = params.get("demo") === "true";

    if (isDemo) {
      setData({ ...DEMO_DATA, promises: [], loading: false, error: null, isDemo: true });
      return;
    }

    async function loadData() {
      try {
        const result = await getMapComplaints();
        const aiInsightsResult = await getAICommunityInsights();

        if (!result.success) {
          setData(prev => ({
            ...prev, loading: false, error: null, isDemo: false,
            complaints: DEMO_DATA.complaints, promises: [], stats: DEMO_DATA.stats, hotspots: []
          }));
          return;
        }

        setData({
          complaints: result.complaints?.length ? result.complaints : DEMO_DATA.complaints,
          promises: result.promises || [],
          stats: result.stats || DEMO_DATA.stats,
          hotspots: aiInsightsResult.success ? aiInsightsResult.data?.hotspots || [] : [],
          loading: false,
          error: null,
          isDemo: false
        });
      } catch (err) {
        setData({ ...DEMO_DATA, promises: [], loading: false, error: null, isDemo: true });
      }
    }
    loadData();
  }, []);

  // Load user's complaints for the tracker panel
  useEffect(() => {
    async function loadMyComplaints() {
      try {
        const result = await getUserMapComplaints();
        if (result.success && result.complaints) {
          setMyComplaints(result.complaints);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setMyComplaintsLoading(false);
      }
    }
    loadMyComplaints();
  }, []);

  // Handle "Locate on Map" from the tracker panel
  const handleLocateComplaint = (complaint: any) => {
    if (complaint.latitude && complaint.longitude) {
      setSelectedComplaintId(complaint.id);
      setFlyToTarget({ lat: complaint.latitude, lng: complaint.longitude, zoom: 17 });
      // Clear flyToTarget after animation to allow re-clicking same complaint
      setTimeout(() => setFlyToTarget(null), 2000);
    }
  };

  const handleSelectComplaint = (complaint: any) => {
    setSelectedComplaintId(complaint.id);
  };

  const filterComplaints = (complaints: any[]) => {
    if (!activeFilters.length) return complaints;
    return complaints.filter((c) => {
      const cat = (c.category || "").toLowerCase();
      return activeFilters.some((f) => {
        if (f === "Road") return cat.includes("road") || cat.includes("pothole") || cat.includes("infrastructure");
        if (f === "Sanitation") return cat.includes("sanitation") || cat.includes("garbage") || cat.includes("waste") || cat.includes("water");
        if (f === "Others") return !cat.includes("road") && !cat.includes("pothole") && !cat.includes("sanitation") && !cat.includes("garbage");
        return true;
      });
    });
  };

  const visibleComplaints = filterComplaints(data.complaints);

  return (
    <DemoShield name="CommunityMapPage">
      <SpinnerGuard loading={data.loading} timeoutMs={3000}
        fallback={<div className={styles.mapLoading}>Map is temporarily stabilizing. Demo data is available via ?demo=true</div>}
      >
        <div className={styles.container}>
          {/* Full-screen map */}
          <main className={styles.mapContainer}>
            <MapView
              complaints={visibleComplaints}
              promises={data.promises}
              hotspots={data.hotspots}
              onComplaintSelect={setSelectedComplaint}
              flyToTarget={flyToTarget}
              selectedComplaintId={selectedComplaintId}
            />
          </main>

          {/* My Complaints Tracker Panel */}
          <MyComplaintsPanel
            complaints={myComplaints}
            loading={myComplaintsLoading}
            isAuthenticated={isAuthenticated}
            selectedId={selectedComplaintId}
            onLocate={handleLocateComplaint}
            onSelect={handleSelectComplaint}
          />

          {/* BOTTOM: Filter panel */}
          <div className={`${styles.floatingPanel} dark:bg-slate-950/90`}>
            <button
              className="flex items-center justify-between w-full font-bold text-slate-900 dark:text-white"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span>Map Filters</span>
              {isFilterOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="pt-4 flex flex-col gap-5">
                    {/* Category checkboxes */}
                    <div>
                      <div style={{ marginBottom: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#8a9bb0', textTransform: 'uppercase' }}>Category</div>
                      <div className={styles.filterGroup}>
                        {CATEGORIES.map(cat => (
                          <button key={cat} className={styles.filterBtn} onClick={() => toggleFilter(cat)}>
                            <div className={`${styles.filterCheckbox} ${activeFilters.includes(cat) ? styles.filterCheckboxActive : ''}`}>
                              {activeFilters.includes(cat) && <Check size={10} color="white" />}
                            </div>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status legend */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8a9bb0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</div>
                      <div className={styles.statusLegend}>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendDot}`} style={{ background: '#ef4444' }} />
                          Submitted
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendDot}`} style={{ background: '#f59e0b' }} />
                          Under Review
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendDot} ${styles.legendDotOrange}`} />
                          In Progress
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendDot} ${styles.legendDotGreen}`} />
                          Resolved
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Detail slide-in panel */}
          <div className={`${styles.slideInPanel} ${selectedComplaint ? styles.open : ''}`}>
            {selectedComplaint && (
              <div>
                <button onClick={() => setSelectedComplaint(null)} style={{ marginBottom: '1rem', fontWeight: 700, color: '#12264a', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>← Close</button>

                <div className={styles.detailStatusPill}>
                  {selectedComplaint.status.replace(/_/g, ' ')}
                </div>
                <span style={{ float: 'right', fontSize: '0.8rem', color: '#8a9bb0' }}>
                  {selectedComplaint.createdAt
                    ? new Date(selectedComplaint.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </span>

                <h2 className={styles.detailTitle}>{selectedComplaint.title}</h2>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>
                  {selectedComplaint.category} · {selectedComplaint.status?.replace(/_/g, " ")}
                </p>

                {selectedComplaint.description && (
                  <p style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "1rem", lineHeight: 1.5 }}>
                    {selectedComplaint.description}
                  </p>
                )}

                {selectedComplaint.location && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div className={styles.detailLabel}>Location</div>
                    <p style={{ fontSize: "0.85rem", color: "#334155", margin: 0 }}>{selectedComplaint.location}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className={styles.detailLabel}>Timeline</div>
                <div className={styles.timeline}>
                  <div className={styles.timelineStep}>
                    <div className={`${styles.timelineDot} ${styles.timelineDotActive}`} />
                    <span className={styles.timelineText}>Complaint Filed</span>
                  </div>
                  <div className={styles.timelineStep}>
                    <div className={`${styles.timelineDot} ${['UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'].includes(selectedComplaint.status) ? styles.timelineDotActive : styles.timelineDotInactive}`} />
                    <span className={styles.timelineText}>Under Review</span>
                  </div>
                  <div className={styles.timelineStep}>
                    <div className={`${styles.timelineDot} ${selectedComplaint.status === 'RESOLVED' ? styles.timelineDotActive : styles.timelineDotInactive}`} />
                    <span className={styles.timelineText}>Resolution</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SpinnerGuard>
    </DemoShield>
  );
}
