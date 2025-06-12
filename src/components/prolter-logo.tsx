// src/components/prolter-logo.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

// INSTRUCTIONS FOR USING YOUR ACTUAL SVG:
// 1. Make sure your SVG file (e.g., `prolter-logo.svg`) is in the `src/app/assets` folder.
// 2. The import below attempts to load it. Ensure the path is correct for your project structure.
import MyActualLogo from '@/app/assets/prolter-logo.svg'; // Path updated as per user
// 3. The component will now try to render MyActualLogo.
// 4. Ensure your actual SVG's paths use `fill="currentColor"` or have no hardcoded fill
//    if you want the theme/prop to control the color via the `fill` prop on MyActualLogo.

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

  // Use the imported SVG component
  return (
    <MyActualLogo
      width={width}
      height={height}
      fill={fillColor} // This fill can be controlled by theme or fixedColor prop
      aria-label="Prolter Logo"
      {...restProps} // Spreads other SVG props like className, etc.
    />
  );
}
