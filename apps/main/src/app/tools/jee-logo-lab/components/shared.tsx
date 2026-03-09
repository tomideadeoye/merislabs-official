import { motion } from 'framer-motion';

export const JEE_BRAND = {
    colors: {
        primary: '#000000',
        accent: '#ff2626',
        gold: '#D4AF37',
        silver: '#E5E7EB',
        white: '#FFFFFF',
    },
    fonts: {
        serif: 'Georgia, serif',
        sans: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace'
    }
};

export interface ConceptProps {
    primaryColor: string;
    accentColor: string;
    bgColor?: string;
    theme?: 'light' | 'dark';
}

export const AssemblyPath = ({ d, color, width, delay = 0, opacity = 1, glow = false }: any) => (
    <g>
        {glow && (
            <motion.path
                d={d}
                stroke={color}
                strokeWidth={width * 2.5}
                strokeLinecap="round"
                className="opacity-10 blur-xl"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay, ease: "easeInOut" }}
            />
        )}
        <motion.path
            d={d}
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            style={{ opacity }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay, ease: "easeInOut" }}
        />
    </g>
);

export const PortalRing = ({ r, color, delay = 0, strokeWidth = 12, dashArray = "", rotation = 0 }: any) => (
    <motion.circle
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1, rotate: rotation }}
        transition={{
            pathLength: { duration: 2, delay, ease: "circOut" },
            opacity: { duration: 0.5, delay },
            rotate: rotation !== 0 ? { duration: 30, repeat: Infinity, ease: "linear" } : {}
        }}
    />
);

export const DataMarker = ({ x, y, label }: any) => (
    <g transform={`translate(${x}, ${y})`} className="opacity-20 font-mono text-[7px] uppercase tracking-tighter fill-current">
        <rect x="-1" y="-8" width="0.5" height="16" className="fill-current" />
        <text x="5" y="0">{label}</text>
    </g>
);
