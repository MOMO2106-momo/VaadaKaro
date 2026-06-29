/**
 * VaadaKaro Unified Design System
 * Single source of truth for spacing, colors, typography, and component patterns
 */

// ==================== SPACING SYSTEM ====================
export const spacing = {
  container: {
    maxWidth: '1440px',
    padding: 'px-6 lg:px-12',
  },
  card: {
    padding: 'p-8 lg:p-10',
    radius: 'rounded-2xl',
  },
  section: {
    gap: 'gap-8 lg:gap-10',
    space: 'space-y-8 lg:space-y-10',
  },
  form: {
    gap: 'gap-6',
    space: 'space-y-6',
  },
} as const;

// ==================== COLOR SYSTEM ====================
export const colors = {
  backgrounds: {
    primary: '#020817',      // Main app background
    secondary: '#0F172A',    // Card backgrounds
    tertiary: '#1A2234',     // Input backgrounds
    elevated: '#1E293B',     // Elevated surfaces
  },
  borders: {
    default: 'border-slate-800',
    subtle: 'border-slate-800/50',
    hover: 'hover:border-slate-700',
  },
  accents: {
    primary: 'emerald',      // Primary brand color
    secondary: 'blue',       // Secondary accent
    success: 'emerald',
    warning: 'amber',
    error: 'rose',
    info: 'blue',
  },
  text: {
    primary: 'text-white',
    secondary: 'text-slate-300',
    muted: 'text-slate-400',
    subtle: 'text-slate-500',
  },
} as const;

// ==================== TYPOGRAPHY SYSTEM ====================
export const typography = {
  pageTitle: 'text-3xl lg:text-4xl font-extrabold text-white tracking-tight',
  sectionTitle: 'text-xl lg:text-2xl font-bold text-white',
  cardTitle: 'text-lg font-bold text-white',
  label: 'text-[13px] font-bold text-slate-300 uppercase tracking-wider',
  body: 'text-[15px] text-slate-300 leading-relaxed',
  helper: 'text-[13px] text-slate-400',
  caption: 'text-[12px] text-slate-500 font-medium',
} as const;

// ==================== COMPONENT PATTERNS ====================
export const patterns = {
  card: 'bg-[#0F172A] border border-slate-800 rounded-2xl shadow-sm',
  input: {
    base: 'w-full bg-[#1A2234] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-[15px] text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium hover:border-slate-600 shadow-sm shadow-black/10',
    icon: 'absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none',
  },
  button: {
    primary: 'w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-[15px] uppercase tracking-wide group',
    secondary: 'px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-700',
    outline: 'px-6 py-3.5 bg-transparent border-2 border-slate-700 hover:border-slate-600 text-slate-300 rounded-xl font-bold transition-all',
  },
  alert: {
    error: 'bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm',
    info: 'bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm',
  },
} as const;

// ==================== LAYOUT PATTERNS ====================
export const layouts = {
  auth: {
    container: 'min-h-screen bg-[#020817] flex items-center justify-center p-6 lg:p-12',
    card: 'w-full max-w-[500px] bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-8 lg:p-10 flex flex-col relative overflow-hidden',
  },
  dashboard: {
    container: 'min-h-screen bg-[#020817] text-slate-100 flex flex-col font-sans',
    main: 'max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 flex-1 flex flex-col space-y-10',
  },
  wizard: {
    container: 'min-h-screen bg-[#020817] font-sans',
    main: 'flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-10 flex flex-col gap-10',
    grid: 'grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-10 items-start',
    sidebar: 'hidden xl:flex flex-col sticky top-28 bg-[#0F172A] rounded-2xl border border-slate-800 p-8 shadow-sm',
    form: 'flex flex-col bg-[#0F172A] rounded-2xl border border-slate-800 p-8 lg:p-10 shadow-sm relative w-full overflow-hidden',
  },
} as const;

// ==================== RESPONSIVE BREAKPOINTS ====================
export const breakpoints = {
  mobile: 'mobile',
  tablet: 'md:',
  desktop: 'lg:',
  wide: 'xl:',
} as const;