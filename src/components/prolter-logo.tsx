// src/components/prolter-logo.tsx

'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

// INSTRUCTIONS FOR USING YOUR ACTUAL SVG:
// 1. Make sure your SVG file (e.g., `my-actual-logo.svg`) is in the `src/assets` folder.
// 2. Uncomment the line below and adjust the filename if necessary:
// import MyActualLogo from '@/assets/prolter-logo.svg';
// 3. Replace the entire <svg>...</svg> block in the return statement below with:
//    <MyActualLogo
//      width={width}
//      height={height}
//      fill={fillColor} // This fill can be controlled by theme or fixedColor prop
//      aria-label="Prolter Logo"
//      {...restProps}
//    />
// 4. Ensure your actual SVG's paths use `fill="currentColor"` or have no hardcoded fill if you want the theme/prop to control the color.

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

  // Placeholder SVG (Text-based)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 131 32" // Adjust viewBox to match your desired aspect ratio
      fill={fillColor}
      width={width}
      height={height}
      aria-label="Prolter Logo"
      {...restProps}
    >
      <text
        x="50%"
        y="50%"
        fontFamily="Arial, sans-serif" // Or your brand's font if available
        fontSize="20" // Adjust font size as needed
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central" // Use "central" for better vertical alignment
      >
        PROLTER
      </text>
    </svg>
  );
}
