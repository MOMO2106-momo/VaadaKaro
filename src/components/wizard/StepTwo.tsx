"use client";

import { useState } from "react";
import { Info, Phone, MapPin, Building2, ChevronDown, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { WizardFormData } from "@/types/wizard";
import { STATES } from "@/types/wizard";

interface StepTwoProps {
    formData: WizardFormData;
    update: (field: keyof WizardFormData, value: any) => void;
}

export default function StepTwo({ formData, update }: StepTwoProps) {
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);

    const handleGpsDetect = () => {
        if (!navigator.geolocation) {
            setGpsError("Geolocation is not supported by your browser.");
            return;
        }
        setGpsLoading(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                update("latitude", latitude as any);
                update("longitude", longitude as any);

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    if (!res.ok) throw new Error("Reverse geocoding failed");
                    const data = await res.json();
                    
                    const countryCode = data.address?.country_code;
                    if (countryCode && countryCode.toLowerCase() !== "in") {
                        setGpsError("VaadaKaro is only available for complaints within India. Foreign locations/pincodes are not permitted.");
                        setGpsLoading(false);
                        return;
                    }

                    const state = data.address?.state || "";
                    const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.county || "";
                    const pincode = data.address?.postcode || "";
                    
                    const road = data.address?.road || "";
                    const neighbourhood = data.address?.neighbourhood || "";
                    const addressLine = [neighbourhood, road].filter(Boolean).join(", ") || data.display_name || "";

                    // Find matching state from our official list if possible, or capitalize properly
                    const matchedState = STATES.find(s => s.toLowerCase() === state.toLowerCase()) || state;

                    update("state", matchedState);
                    update("city", city);
                    update("pincode", pincode.replace(/\D/g, ""));
                    update("address", addressLine);
                } catch (err) {
                    setGpsError("Could not retrieve street address automatically. Please type details manually.");
                } finally {
                    setGpsLoading(false);
                }
            },
            (error) => {
                setGpsError("Location access denied or timed-out. Please type details manually.");
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const isPincodeValid = formData.pincode ? /^[1-9][0-9]{5}$/.test(formData.pincode) : true;

    const handlePincodeChange = async (val: string) => {
        const cleaned = val.replace(/\D/g, "");
        update("pincode", cleaned);

        if (cleaned.length === 6) {
            const isValid = /^[1-9][0-9]{5}$/.test(cleaned);
            if (isValid) {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${cleaned}&country=India&format=json`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.length > 0) {
                            const lat = parseFloat(data[0].lat);
                            const lon = parseFloat(data[0].lon);
                            update("latitude", lat);
                            update("longitude", lon);
                        }
                    }
                } catch (e) {
                    // fallback silent
                }
            }
        }
    };

    return (
        <div className="flex flex-col space-y-8 w-full">
            <header className="space-y-2 border-b border-slate-200 dark:border-slate-800/60 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Location & Jurisdiction</h2>
                <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium leading-relaxed max-w-3xl">
                    Pinpoint the site of the incident precisely. Accurate geographical boundaries are necessary for automatic departmental routing across local civic authorities.
                </p>
            </header>

            {/* GPS Detection Panel */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <MapPin size={22} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                        <strong className="text-emerald-700 dark:text-emerald-400 uppercase tracking-widest text-[11px] block mb-0.5">Satellite GPS Auto-Fill</strong>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-snug">
                            Auto-detect your position and fetch your official address and Indian postal code instantly.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleGpsDetect}
                    disabled={gpsLoading}
                    className="shrink-0 flex items-center justify-center gap-2.5 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-[13px] shadow-sm uppercase tracking-wider"
                >
                    {gpsLoading ? "Locating..." : "📍 Auto-Detect"}
                </button>
            </div>

            {gpsError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-450 rounded-xl text-[13.5px] font-bold flex items-start gap-3 shadow-sm">
                    <span className="shrink-0 mt-0.5">⚠️</span> <span className="leading-relaxed">{gpsError}</span>
                </div>
            )}

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                        State / Union Territory <span className="text-rose-550">*</span>
                    </label>
                    <div className="relative">
                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none z-10" />
                        <select
                            id="state"
                            style={{ paddingLeft: "3.25rem" }}
                            className="appearance-none w-full h-[54px] pr-10 bg-slate-50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-[15px] font-medium cursor-pointer shadow-sm"
                            value={formData.state}
                            onChange={(e) => update("state", e.target.value)}
                        >
                            <option value="">Select Region</option>
                            {STATES.map((s) => (
                                <option key={s} value={s} className="bg-white dark:bg-[#1A2234] text-slate-900 dark:text-white">{s}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none" />
                    </div>
                </div>

                <Input
                    label="City / Ward District"
                    required
                    type="text"
                    placeholder="e.g. Bandra West, Mumbai"
                    value={formData.city}
                    onChange={(e) => update("city", e.target.value)}
                    icon={Building2}
                />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Postal Code (PIN)"
                    required
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit official pin"
                    value={formData.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    icon={MapPin}
                    error={formData.pincode && !isPincodeValid ? "Invalid Indian pincode" : undefined}
                />

                <Input
                    label="Emergency Contact Target"
                    required
                    type="tel"
                    placeholder="+91 Verified Number"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    icon={Phone}
                />
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Specific Street Address / Visual Landmark Indicators <span className="text-rose-550">*</span>
                </label>
                <div className="relative">
                    <textarea
                        id="address" 
                        rows={4}
                        className="w-full bg-slate-50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-405 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm resize-y"
                        placeholder="House Number, Street Identity, Landmark Proximities..."
                        value={formData.address} 
                        onChange={(e) => update("address", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
