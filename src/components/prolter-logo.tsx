// src/components/prolter-logo.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
// Assuming your SVGR setup allows direct import of SVG as a ReactComponent.
// Make sure 'src/app/assets/prolter-logo.svg' exists.
import ActualLogo from '@/app/assets/prolter-logo.svg'; // Changed from LogoComponent

interface ProlterLogoProps {
  fixedColor?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function ProlterLogo({
  fixedColor,
  width = "100", // Default width
  height = "24", // Default height
  className,
  ...rest
}: ProlterLogoProps & React.HTMLAttributes<HTMLDivElement>) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  let effectiveColor = "hsl(var(--foreground))";
  if (fixedColor) {
    effectiveColor = fixedColor;
  } else if (isMounted) {
    effectiveColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  }

  const svgWidth = typeof width === 'number' ? `${width}px` : width;
  const svgHeight = typeof height === 'number' ? `${height}px` : height;

  if (!isMounted && !fixedColor) {
    return <div style={{ width: svgWidth, height: svgHeight }} aria-label="Prolter Logo" {...rest} />;
  }

  return (
    <div
      className={className}
      style={{ 
        width: svgWidth, 
        height: svgHeight,
        color: effectiveColor
      }}
      {...rest}
    >
      <ActualLogo width="100%" height="100%" />
    </div>
  );
}
