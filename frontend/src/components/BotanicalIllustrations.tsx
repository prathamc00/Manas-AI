import React from 'react';

/**
 * High-fidelity, crisp Botanical & Organic vector illustrations for MANAS.
 * Rendered inline as pure SVG components to guarantee zero broken image assets.
 */

export const BotanicalMark: React.FC<{ size?: number; className?: string }> = ({
  size = 38,
  className = '',
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`inline-block select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="markLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8c9a84" />
        <stop offset="60%" stopColor="#2d3a31" />
        <stop offset="100%" stopColor="#1a231d" />
      </linearGradient>
      <linearGradient id="markTerraGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c27b66" />
        <stop offset="100%" stopColor="#e49d8a" />
      </linearGradient>
    </defs>
    {/* Soft organic circular backing */}
    <circle cx="50" cy="50" r="46" fill="#e9ddd2" fillOpacity="0.65" />
    
    {/* Stylized M-curve / double botanical arch */}
    <path
      d="M26 74 C26 44 42 26 50 20 C58 26 74 44 74 74 C66 60 58 52 50 52 C42 52 34 60 26 74 Z"
      fill="url(#markLeafGrad)"
    />
    
    {/* Center central stem */}
    <path
      d="M50 20 V76"
      stroke="#f9f8f4"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="1 2"
    />
    
    {/* Floating terracotta seed / warmth beacon */}
    <circle cx="50" cy="64" r="4.5" fill="url(#markTerraGrad)" />
  </svg>
);

export const BotanicalHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 540 640"
    className={`w-full h-full object-cover select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="heroBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5eee5" />
        <stop offset="50%" stopColor="#ede2d5" />
        <stop offset="100%" stopColor="#dbc8b5" />
      </linearGradient>
      <linearGradient id="leafGradDark" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#253228" />
        <stop offset="100%" stopColor="#4f6353" />
      </linearGradient>
      <linearGradient id="leafGradLight" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6e826e" />
        <stop offset="100%" stopColor="#9cb09b" />
      </linearGradient>
      <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c27b66" />
        <stop offset="100%" stopColor="#8d4b38" />
      </linearGradient>
      <linearGradient id="sunBeam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* Background canvas */}
    <rect width="540" height="640" fill="url(#heroBgGrad)" />

    {/* Architectural Arch Window */}
    <path
      d="M100 640 V240 C100 146 176 70 270 70 C364 70 440 146 440 240 V640 Z"
      fill="#ffffff"
      fillOpacity="0.85"
    />

    {/* Gentle sunlight ray entering the arch */}
    <polygon points="170,70 330,70 490,640 210,640" fill="url(#sunBeam)" />

    {/* Decorative soft wall circle */}
    <circle cx="270" cy="240" r="140" stroke="#d5c8bb" strokeWidth="1.5" strokeDasharray="4 6" fill="none" opacity="0.6" />

    {/* Table / Surface base */}
    <rect x="70" y="520" width="400" height="120" rx="16" fill="#e7ded4" />
    <line x1="70" y1="520" x2="470" y2="520" stroke="#cbbdb0" strokeWidth="2" />

    {/* Large Botanical Plant foliage */}
    {/* Left sweeping leaf */}
    <path
      d="M270 420 C180 340 140 220 180 130 C220 180 250 280 270 420 Z"
      fill="url(#leafGradDark)"
    />
    <path d="M210 210 Q240 280 270 420" stroke="#879a85" strokeWidth="1.5" fill="none" />

    {/* Right sweeping leaf */}
    <path
      d="M270 420 C360 330 410 200 370 120 C330 170 300 280 270 420 Z"
      fill="url(#leafGradDark)"
      fillOpacity="0.95"
    />
    <path d="M330 200 Q300 270 270 420" stroke="#879a85" strokeWidth="1.5" fill="none" />

    {/* Central upward sprouting frond */}
    <path
      d="M270 420 C250 280 250 160 270 80 C290 160 290 280 270 420 Z"
      fill="url(#leafGradLight)"
    />
    <line x1="270" y1="80" x2="270" y2="420" stroke="#f0ece6" strokeWidth="1.5" />

    {/* Low soft sage leaves */}
    <path
      d="M270 420 C200 400 160 330 190 270 C220 310 240 370 270 420 Z"
      fill="url(#leafGradLight)"
      fillOpacity="0.85"
    />
    <path
      d="M270 420 C340 400 380 330 350 270 C320 310 300 370 270 420 Z"
      fill="url(#leafGradLight)"
      fillOpacity="0.85"
    />

    {/* Handcrafted Terracotta Ceramic Planter */}
    <path
      d="M225 410 L315 410 C328 410 336 422 332 435 L310 525 C308 532 302 537 294 537 L246 537 C238 537 232 532 230 525 L208 435 C204 422 212 410 225 410 Z"
      fill="url(#potGrad)"
    />
    {/* Pot rim highlight */}
    <rect x="216" y="405" width="108" height="12" rx="6" fill="#dda18f" />

    {/* Journal Notebook on Table */}
    <g transform="rotate(-6 350 510)">
      <rect x="330" y="495" width="105" height="65" rx="6" fill="#2d3a31" />
      <rect x="334" y="499" width="97" height="57" rx="4" fill="#fdfbf7" />
      {/* Journal lines */}
      <line x1="344" y1="514" x2="415" y2="514" stroke="#c5cfc2" strokeWidth="2" strokeLinecap="round" />
      <line x1="344" y1="524" x2="405" y2="524" stroke="#c5cfc2" strokeWidth="2" strokeLinecap="round" />
      <line x1="344" y1="534" x2="385" y2="534" stroke="#c5cfc2" strokeWidth="2" strokeLinecap="round" />
      {/* Bookmark ribbon */}
      <path d="M375 495 V550 L380 544 L385 550 V495 Z" fill="#c27b66" />
    </g>
  </svg>
);

export const BotanicalMemoryIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 540 540"
    className={`w-full h-full object-cover select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="memBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8eee5" />
        <stop offset="50%" stopColor="#dce4d8" />
        <stop offset="100%" stopColor="#cbd5c6" />
      </linearGradient>
      <linearGradient id="jarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#e8f0e6" stopOpacity="0.7" />
      </linearGradient>
    </defs>

    {/* Canvas Background */}
    <rect width="540" height="540" rx="36" fill="url(#memBackGrad)" />

    {/* Concentric botanical rings */}
    <circle cx="270" cy="290" r="190" stroke="#b9c7b6" strokeWidth="1" strokeDasharray="6 8" fill="none" />
    <circle cx="270" cy="290" r="140" stroke="#b9c7b6" strokeWidth="1.5" strokeDasharray="3 5" fill="none" opacity="0.6" />

    {/* Hand-thrown Ceramic Memory Urn */}
    <path
      d="M210 200 L330 200 C365 200 385 240 395 310 C405 380 375 430 335 430 L205 430 C165 430 135 380 145 310 C155 240 175 200 210 200 Z"
      fill="url(#jarGlass)"
      stroke="#b2c2af"
      strokeWidth="2.5"
    />

    {/* Warm terracotta cork seal */}
    <rect x="200" y="165" width="140" height="35" rx="8" fill="#c27b66" />
    <rect x="210" y="160" width="120" height="8" rx="4" fill="#a85e49" />

    {/* Sprouting memory vines growing from within */}
    <path
      d="M270 165 C240 80 190 70 170 35"
      fill="none"
      stroke="#2d3a31"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path d="M195 70 C165 60 160 85 180 95 C195 95 195 75 195 70 Z" fill="#8c9a84" />
    <path d="M225 105 C200 95 195 115 215 125 C225 125 225 105 225 105 Z" fill="#2d3a31" />

    <path
      d="M270 165 C300 80 350 70 370 35"
      fill="none"
      stroke="#2d3a31"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path d="M345 70 C375 60 380 85 360 95 C345 95 345 75 345 70 Z" fill="#8c9a84" />
    <path d="M315 105 C340 95 345 115 325 125 C315 125 315 105 315 105 Z" fill="#2d3a31" />

    {/* Floating Memory Context Cards inside the jar */}
    <g transform="rotate(-7 250 270)">
      <rect x="185" y="245" width="130" height="42" rx="10" fill="#2d3a31" />
      <circle cx="205" cy="266" r="4.5" fill="#8c9a84" />
      <rect x="220" y="260" width="75" height="5.5" rx="2.5" fill="#ffffff" />
      <rect x="220" y="269" width="45" height="4.5" rx="2" fill="#a4b3a1" />
    </g>

    <g transform="rotate(8 290 340)">
      <rect x="215" y="315" width="145" height="44" rx="10" fill="#ffffff" stroke="#c0d0bd" strokeWidth="1.5" />
      <circle cx="235" cy="337" r="4.5" fill="#c27b66" />
      <rect x="250" y="331" width="85" height="5.5" rx="2.5" fill="#2d3a31" />
      <rect x="250" y="340" width="55" height="4.5" rx="2" fill="#7d8c7c" />
    </g>

    <g transform="rotate(-3 250 390)">
      <rect x="180" y="365" width="150" height="40" rx="10" fill="#f4ece2" stroke="#d5c8ba" strokeWidth="1.5" />
      <circle cx="200" cy="385" r="4.5" fill="#8c9a84" />
      <rect x="215" y="379" width="90" height="5.5" rx="2.5" fill="#2d3a31" />
      <rect x="215" y="388" width="60" height="4.5" rx="2" fill="#9e8d7e" />
    </g>
  </svg>
);

export const BotanicalGroundingIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 500 500"
    className={`w-full h-full object-cover select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="groundBgGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3d4f42" />
        <stop offset="70%" stopColor="#253229" />
        <stop offset="100%" stopColor="#141c16" />
      </radialGradient>
      <linearGradient id="stoneTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f7f2eb" />
        <stop offset="100%" stopColor="#cfc4b6" />
      </linearGradient>
      <linearGradient id="stoneMidTerra" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dda18f" />
        <stop offset="100%" stopColor="#b4644f" />
      </linearGradient>
      <linearGradient id="stoneMidSage" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b3c2ae" />
        <stop offset="100%" stopColor="#7a8d76" />
      </linearGradient>
      <linearGradient id="stoneBase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7b8979" />
        <stop offset="100%" stopColor="#455444" />
      </linearGradient>
    </defs>

    {/* Deep Forest Backing */}
    <rect width="500" height="500" rx="250" fill="url(#groundBgGrad)" />

    {/* Concentric Zen Ripple Rings */}
    <circle cx="250" cy="250" r="220" stroke="#8c9a84" strokeWidth="1" opacity="0.25" fill="none" />
    <circle cx="250" cy="250" r="170" stroke="#8c9a84" strokeWidth="1.2" opacity="0.35" fill="none" />
    <circle cx="250" cy="250" r="120" stroke="#8c9a84" strokeWidth="1.5" opacity="0.5" fill="none" />
    <circle cx="250" cy="250" r="70" stroke="#8c9a84" strokeWidth="1.5" opacity="0.65" fill="none" />

    {/* Stacked Smooth River Cairn Stones */}
    {/* Base Stone */}
    <ellipse cx="250" cy="330" rx="100" ry="42" fill="url(#stoneBase)" />
    <ellipse cx="250" cy="326" rx="94" ry="36" fill="#586757" opacity="0.6" />

    {/* Second Stone (Sage) */}
    <ellipse cx="250" cy="272" rx="76" ry="32" fill="url(#stoneMidSage)" />
    <ellipse cx="250" cy="269" rx="70" ry="27" fill="#8ea08a" opacity="0.6" />

    {/* Third Stone (Warm Terracotta Accent) */}
    <ellipse cx="250" cy="222" rx="54" ry="24" fill="url(#stoneMidTerra)" />
    <ellipse cx="250" cy="219" rx="48" ry="20" fill="#e7b2a3" opacity="0.5" />

    {/* Top Peak Stone (Smooth White Marble) */}
    <ellipse cx="250" cy="180" rx="34" ry="16" fill="url(#stoneTop)" />
    <ellipse cx="250" cy="178" rx="28" ry="12" fill="#ffffff" opacity="0.7" />

    {/* Delicate Fern Sprout curling around cairn */}
    <path
      d="M170 360 C180 300 200 240 220 200"
      stroke="#a4b89f"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="220" cy="200" r="3" fill="#a4b89f" />
  </svg>
);
