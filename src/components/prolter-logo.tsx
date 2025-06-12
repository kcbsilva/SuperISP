
// src/components/prolter-logo.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

// INSTRUCTIONS FOR USING YOUR ACTUAL SVG:
// 1. Make sure your SVG file (e.g., `prolter-logo.svg`) is in a suitable public or assets folder.
//    For example, if you place it in `public/assets/prolter-logo.svg`,
//    you could use an <Image> component from Next.js or directly use an <img> tag.
// 2. If you want to embed the SVG markup directly for dynamic color changes via `fill="currentColor"`,
//    replace the placeholder <svg> below with your actual SVG content.
//    Ensure its paths use `fill="currentColor"` or have no hardcoded fill.

interface ProlterLogoProps extends React.SVGProps<SVGSVGElement> {
  fixedColor?: string;
  width?: string | number;
  height?: string | number;
}

export function ProlterLogo({ fixedColor, width = "131", height = "32", ...restProps }: ProlterLogoProps) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  let fillColor = "hsl(var(--foreground))"; // Default fill
  if (fixedColor) {
    fillColor = fixedColor;
  } else if (isMounted) {
    // Theme-aware fill color if no fixedColor is provided
    fillColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  }

  if (!isMounted && !fixedColor) {
    // Fallback for SSR or when theme isn't ready
    // Render a div with fixed dimensions to prevent layout shift.
    return <div style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }} aria-label="Prolter Logo" />;
  }

  // Using a simple text-based SVG as a placeholder
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 131 32" // Adjust viewBox to fit "PROLTER"
      fill={fillColor}
      width={width}
      height={height}
      aria-label="Prolter Logo"
      {...restProps}
    >
      <text
        x="50%"
        y="50%"
        fontFamily="Arial, sans-serif" // Using a common font for portability
        fontSize="20" // Adjusted font size
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        PROLTER
      </text>
    </svg>
  );
}
