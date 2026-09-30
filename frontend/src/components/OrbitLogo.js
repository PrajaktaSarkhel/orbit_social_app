import React from 'react';
import { Box } from '@mui/material';

const OrbitLogo = ({ size = 36, sx = {} }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...sx,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="orbitCompBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="planetCompGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="60%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          <linearGradient id="ringCompGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Rounded Container */}
        <rect width="64" height="64" rx="16" fill="url(#orbitCompBg)" />

        {/* Orbit System */}
        <g transform="rotate(-28 32 32)">
          {/* Back Arc of Orbit Ring */}
          <path
            d="M 9 32 A 23 8 0 0 1 55 32"
            stroke="url(#ringCompGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Central Planet */}
          <circle cx="32" cy="32" r="11" fill="url(#planetCompGrad)" />
          {/* Highlight */}
          <circle cx="28.5" cy="28.5" r="3.2" fill="#ffffff" opacity="0.45" />

          {/* Front Arc of Orbit Ring */}
          <path
            d="M 55 32 A 23 8 0 0 1 9 32"
            stroke="url(#ringCompGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Satellite */}
          <circle cx="50" cy="34.5" r="3" fill="#38bdf8" />
          <circle cx="50" cy="34.5" r="1.4" fill="#ffffff" />
        </g>
      </svg>
    </Box>
  );
};

export default OrbitLogo;
