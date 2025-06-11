// src/components/prolter-logo.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

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

  let fillColor = "hsl(var(--foreground))";
  if (fixedColor) {
    fillColor = fixedColor;
  } else if (isMounted) {
    fillColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  }

  if (!isMounted && !fixedColor) {
    // Fallback for SSR or when theme isn't ready, renders a div with specified dimensions
    return <div style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }} />;
  }

  // INSTRUCTIONS FOR USER:
  // 1. Place your SVG file (e.g., `my-prolter-logo.svg`) in the `src/assets` folder.
  // 2. Import your SVG as a React component at the top of this file:
  //    `import MyActualLogo from '@/assets/my-prolter-logo.svg';`
  //    (Ensure the path and filename are correct. Your `next.config.ts` is already set up for this.)
  // 3. Replace the entire <svg>...</svg> block below with your imported component:
  //    `<MyActualLogo width={width} height={height} fill={fillColor} {...restProps} />`
  // 4. Ensure your SVG's paths use `fill="currentColor"` or do not have a fill attribute if you want the `fillColor` prop to control their color.
  //    Adjust the `viewBox` in the placeholder below if your actual logo has different proportions before replacing it.

  return (
    <div style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }} className="flex items-center justify-center">
      <svg
        viewBox="0 0 131 32" // Adjust this viewBox to match your actual SVG's aspect ratio
        width="100%"
        height="100%"
        fill={fillColor}
        {...restProps}
        aria-label="Prolter Logo"
      >
        {/* START: GENERIC SVG PLACEHOLDER - REPLACE THIS WITH YOUR ACTUAL IMPORTED LOGO COMPONENT */}
        <rect width="131" height="32" rx="5" ry="5" fillOpacity="0.1" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold">
          PROLTER
        </text>
        {/* END: GENERIC SVG PLACEHOLDER */}
      </svg>
    </div>
  );
}
