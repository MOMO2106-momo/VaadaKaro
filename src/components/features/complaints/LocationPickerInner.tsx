"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, MapPin } from "lucide-react";

// VaadaKaro styled complaint marker
const createVaadaIcon = () => L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="background: white; width: 6px; height: 6px; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
    address?: any;
}

export default function LocationPickerInner({
    onLocationUpdate,
    initialLat,
    initialLng
}: {
    onLocationUpdate: (data: any) => void;
    initialLat?: number | null;
    initialLng?: number | null;
}) {
    const defaultCenter: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : [28.6139, 77.2090];
    const [position, setPosition] = useState<[number, number] | null>(initialLat && initialLng ? [initialLat, initialLng] : null);

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Controller hook handling map clicks directly
    function MapController() {
        const map = useMap();

        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                reverseGeocode(lat, lng);
                map.flyTo([lat, lng], 16, { animate: true, duration: 1 });
            }
        });

        return null;
    }

    // Hook to handle external fly-to events from the autocomplete search
    function FlyToController() {
        const map = useMap();
        useEffect(() => {
            const listener = (e: any) => {
                const { lat, lng } = e.detail;
                map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
            };
            window.addEventListener('fly-to-location', listener);
            return () => window.removeEventListener('fly-to-location', listener);
        }, [map]);
        return null;
    }

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
            const data = await res.json();

            if (data && data.address) {
                onLocationUpdate({
                    latitude: lat,
                    longitude: lng,
                    address: data.display_name,
                    city: data.address.city || data.address.town || data.address.village || data.address.county || "",
                    state: data.address.state || "",
                    pincode: data.address.postcode || ""
                });
            } else {
                onLocationUpdate({ latitude: lat, longitude: lng });
            }
        } catch (e) {
            console.error("Reverse geocoding failed", e);
            onLocationUpdate({ latitude: lat, longitude: lng });
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (val.length < 3) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        // 400ms Debounce setup
        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&limit=5`);
                const data = await res.json();
                setSuggestions(data);
                setShowDropdown(true);
            } catch (err) {
                console.error("Geocoding failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 400);
    };

    const handleSelectSuggestion = (suggestion: NominatimResult) => {
        const lat = parseFloat(suggestion.lat);
        const lng = parseFloat(suggestion.lon);

        setPosition([lat, lng]);
        setQuery(suggestion.display_name);
        setShowDropdown(false);

        onLocationUpdate({
            latitude: lat,
            longitude: lng,
            address: suggestion.display_name,
            city: suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || suggestion.address?.county || "",
            state: suggestion.address?.state || "",
            pincode: suggestion.address?.postcode || ""
        });

        // Broadcast flyTo trigger
        window.dispatchEvent(new CustomEvent('fly-to-location', { detail: { lat, lng } }));
    };

    return (
        <div className="relative w-full h-[400px] sm:h-[450px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner z-10 text-left">

            {/* 1. Premium Floating Search UI */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-[90%] md:max-w-md z-[500] flex flex-col gap-1">
                <div className="relative flex items-center bg-white/95 dark:bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-300 dark:border-slate-700 shadow-xl overflow-hidden">
                    <Search size={18} className="ml-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search address, landmark, or locality..."
                        className="w-full bg-transparent px-3 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none"
                        value={query}
                        onChange={handleSearch}
                        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                    />
                    {isSearching && <Loader2 size={18} className="mr-4 text-slate-400 animate-spin" />}
                </div>

                {/* 2. Autocomplete Sub-dropdown */}
                {showDropdown && suggestions.length > 0 && (
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto">
                        {suggestions.map((s, idx) => (
                            <button
                                key={idx}
                                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0 flex items-start gap-3"
                                onClick={() => handleSelectSuggestion(s)}
                            >
                                <MapPin size={16} className="text-emerald-500 mt-1 shrink-0" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-tight">
                                    {s.display_name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Underlying Map Infrastructure */}
            <MapContainer center={defaultCenter} zoom={initialLat ? 16 : 5} scrollWheelZoom={true} className="w-full h-full z-10">
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController />
                <FlyToController />
                {position && (
                    <Marker
                        position={position}
                        icon={createVaadaIcon()}
                        draggable={true}
                        eventHandlers={{
                            dragend: (e) => {
                                const marker = e.target;
                                const pos = marker.getLatLng();
                                setPosition([pos.lat, pos.lng]);
                                reverseGeocode(pos.lat, pos.lng);
                            }
                        }}
                    />
                )}
            </MapContainer>
        </div>
    );
}
