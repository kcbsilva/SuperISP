// src/components/prolter-logo.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
// Assuming your SVGR setup allows direct import of SVG as a ReactComponent.
// Make sure 'src/app/assets/prolter-logo.svg' exists.
import LogoComponent from '@/app/assets/prolter-logo.svg';

interface ProlterLogoProps {
  fixedColor?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  // Remove SVGProps if we are not directly rendering an <svg> tag
}

export function ProlterLogo({
  fixedColor,
  width = "100", // Default width reduced
  height = "24", // Default height reduced
  className,
  ...rest // Capture any other props like aria-label
}: ProlterLogoProps & React.HTMLAttributes<HTMLDivElement>) { // Add HTMLAttributes for the div wrapper
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  let effectiveColor = "hsl(var(--foreground))"; // Default fill if fixedColor is not provided and theme is not ready
  if (fixedColor) {
    effectiveColor = fixedColor;
  } else if (isMounted) {
    // Theme-aware fill color if no fixedColor is provided
    effectiveColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  }

  if (!isMounted && !fixedColor) {
    // Fallback for SSR or when theme isn't ready
    // Render a div with fixed dimensions to prevent layout shift.
    return <div style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }} aria-label="Prolter Logo" {...rest} />;
  }

  return (
    <div
      className={className}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height, 
        color: effectiveColor // Apply color here, SVG should use currentColor for paths that need theming
      }}
      {...rest} // Pass down aria-label etc.
    >
      <LogoComponent width="100%" height="100%" />
    </div>
  );
}
