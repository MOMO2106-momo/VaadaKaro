"use client";
import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// ── Marker icon factory ──────────────────────────────────────────────
const createIcon = (color: string, selected = false) => L.divIcon({
  className: "custom-div-icon",
  html: `<div style="
    background: ${color};
    width: ${selected ? 20 : 14}px;
    height: ${selected ? 20 : 14}px;
    border-radius: 50%;
    border: 2.5px solid white;
    box-shadow: 0 0 ${selected ? 12 : 4}px ${selected ? color : 'rgba(0,0,0,0.4)'};
    ${selected ? 'animation: markerPulse 1.4s ease-in-out infinite;' : ''}
  "></div>`,
  iconSize: [selected ? 20 : 14, selected ? 20 : 14],
  iconAnchor: [selected ? 10 : 7, selected ? 10 : 7],
});

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "#ef4444",
  UNDER_REVIEW: "#f59e0b",
  IN_PROGRESS: "#3b82f6",
  RESOLVED: "#22c55e",
  REJECTED: "#64748b",
  INFO_REQUESTED: "#a855f7",
  DEFAULT: "#64748b",
};

// ── Status badge helper ──────────────────────────────────────────────
const statusBadgeStyle = (status: string): React.CSSProperties => {
  const color = STATUS_COLORS[status] || STATUS_COLORS.DEFAULT;
  return {
    fontSize: "10px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "9999px",
    background: `${color}20`,
    color: color,
    display: "inline-block",
  };
};

// ── Sub-component: fly to location ───────────────────────────────────
function FlyToHandler({ target }: { target: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], target.zoom || 17, { duration: 1.5 });
    }
  }, [target, map]);
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// ── Inject pulse keyframes once ──────────────────────────────────────
function PulseStyleInjector() {
  useEffect(() => {
    if (document.getElementById("marker-pulse-style")) return;
    const style = document.createElement("style");
    style.id = "marker-pulse-style";
    style.textContent = `
      @keyframes markerPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

interface MapProps {
  complaints: any[];
  promises?: any[];
  hotspots?: any[];
  center?: [number, number];
  zoom?: number;
  onComplaintSelect?: (complaint: any) => void;
  flyToTarget?: { lat: number; lng: number; zoom?: number } | null;
  selectedComplaintId?: string | null;
}

export default function MapView({
  complaints,
  promises = [],
  hotspots = [],
  center,
  zoom,
  onComplaintSelect,
  flyToTarget = null,
  selectedComplaintId = null,
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allPoints = [
    ...complaints.filter((c) => c.latitude && c.longitude),
    ...promises.filter((p) => p.latitude && p.longitude),
  ];

  const mapCenter: [number, number] = center || (allPoints.length > 0
    ? [allPoints[0].latitude, allPoints[0].longitude]
    : [28.6139, 77.209]);
  const mapZoom = zoom || (allPoints.length > 0 ? 12 : 5);

  if (!mounted) return <div style={{ height: "100%", minHeight: 500, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Loading map...</div>;

  return (
    <div style={{ height: "100%", minHeight: 500, width: "100%", overflow: "hidden" }}>
      <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%", minHeight: 500 }}>
        <PulseStyleInjector />
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <FlyToHandler target={flyToTarget} />

        {/* Base: Satellite imagery */}
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {/* Overlay: Roads, labels, landmarks, administrative boundaries */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          pane="overlayPane"
        />

        {/* Complaint markers */}
        {complaints.map((complaint) => {
          if (!complaint.latitude || !complaint.longitude || isNaN(complaint.latitude) || isNaN(complaint.longitude)) return null;
          const isSelected = selectedComplaintId === complaint.id;
          const color = STATUS_COLORS[complaint.status] || STATUS_COLORS.DEFAULT;
          const icon = createIcon(color, isSelected);

          return (
            <Marker key={complaint.id} position={[complaint.latitude, complaint.longitude]} icon={icon} eventHandlers={{
              click: () => onComplaintSelect?.(complaint),
            }}>
              <Popup className="custom-popup" maxWidth={300} minWidth={240}>
                <div style={{ padding: "6px 2px", fontFamily: "'Inter', system-ui, sans-serif" }}>
                  {/* Header: category + status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "6px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "4px",
                      background: "#f1f5f9", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px"
                    }}>{complaint.category}</span>
                    <span style={statusBadgeStyle(complaint.status)}>
                      {complaint.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#1e293b", fontWeight: 700, lineHeight: 1.3 }}>
                    {complaint.title}
                  </h3>

                  {/* Track ID */}
                  {complaint.trackingId && (
                    <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace", marginBottom: "8px" }}>
                      ID: {complaint.trackingId.slice(0, 8).toUpperCase()}
                    </div>
                  )}

                  {/* Description preview */}
                  {complaint.description && (
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 8px 0", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                      {complaint.description}
                    </p>
                  )}

                  {/* Info grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", margin: "8px 0", padding: "8px", background: "#f8fafc", borderRadius: "8px", fontSize: "11px" }}>
                    <div>
                      <div style={{ color: "#94a3b8", marginBottom: "1px" }}>Verifications</div>
                      <div style={{ fontWeight: 700, color: "#334155" }}>{complaint._count?.votes || complaint.verifiedScore || 0}</div>
                    </div>
                    <div>
                      <div style={{ color: "#94a3b8", marginBottom: "1px" }}>Comments</div>
                      <div style={{ fontWeight: 700, color: "#334155" }}>{complaint._count?.comments || 0}</div>
                    </div>
                    {complaint.location && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ color: "#94a3b8", marginBottom: "1px" }}>Ward / Area</div>
                        <div style={{ fontWeight: 600, color: "#334155" }}>{complaint.location}</div>
                      </div>
                    )}
                    {complaint.createdAt && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ color: "#94a3b8", marginBottom: "1px" }}>Submitted</div>
                        <div style={{ fontWeight: 600, color: "#334155" }}>
                          {new Date(complaint.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={complaint.trackingId ? `/track-complaint?id=${complaint.trackingId}` : `/track-complaint`}
                    style={{
                      display: "block", padding: "9px", background: "#1e3a8a", color: "white",
                      textAlign: "center", borderRadius: "6px", textDecoration: "none",
                      fontSize: "12px", fontWeight: 700, transition: "background 0.2s",
                      marginTop: "4px"
                    }}
                  >
                    View Full Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Promise markers */}
        {promises.map((promise) => {
          if (!promise.latitude || !promise.longitude) return null;
          return (
            <Marker
              key={`promise-${promise.id}`}
              position={[promise.latitude, promise.longitude]}
              icon={createIcon("#8b5cf6")}
            >
              <Popup>
                <div style={{ minWidth: 180, padding: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#8b5cf6" }}>CIVIC PROMISE</span>
                  <h3 style={{ margin: "6px 0", fontSize: 14, color: "#1e3a8a" }}>{promise.title}</h3>
                  <p style={{ margin: 0, fontSize: 12 }}>{promise.completionRate}% complete · {promise.status}</p>
                  <Link href={`/dashboard/promises/${promise.id}`} style={{ display: "block", marginTop: 8, padding: 8, background: "#8b5cf6", color: "#fff", textAlign: "center", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>
                    View Promise
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Hotspot markers */}
        {hotspots.map((hs) => (
          <CircleMarker
            key={hs.id}
            center={[hs.latitude, hs.longitude]}
            radius={20 + (hs.count * 2)}
            pathOptions={{
              color: hs.priority === 'URGENT' ? '#ef4444' : '#f59e0b',
              fillColor: hs.priority === 'URGENT' ? '#ef4444' : '#f59e0b',
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '5, 10'
            }}
          >
            <Popup>
              <div style={{ padding: '5px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '14px' }}>
                  ⚠️ AI HOTSPOT: {hs.category}
                </h3>
                <p style={{ margin: '0', fontSize: '12px' }}>
                  <strong>{hs.count}</strong> reports detected in this cluster.<br />
                  Priority: <span style={{ color: hs.priority === 'URGENT' ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>{hs.priority}</span>
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
