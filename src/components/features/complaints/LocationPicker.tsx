"use client";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

interface Props {
    onLocationUpdate: (data: any) => void;
    initialLat?: number | null;
    initialLng?: number | null;
}

// Dynamically invoke the map engine to prevent next.js SSR crashing on 'window' references inside leaflet inner cores.
const LocationPickerInner = dynamic<Props>(
    () => import('./LocationPickerInner'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[400px] rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner">
                <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                    <p className="font-semibold text-sm">Loading VaadaKaro Earth Data...</p>
                </div>
            </div>
        )
    }
);

export default function LocationPicker({
    onLocationUpdate,
    initialLat,
    initialLng
}: {
    onLocationUpdate: (data: any) => void;
    initialLat?: number | null;
    initialLng?: number | null;
}) {
    return <LocationPickerInner onLocationUpdate={onLocationUpdate} initialLat={initialLat} initialLng={initialLng} />;
}
