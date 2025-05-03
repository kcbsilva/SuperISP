// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import type { VariantProps} from "class-variance-authority";
import { cva } from "class-variance-authority"
import { PanelLeft, ChevronDown, PanelRight, ChevronLeft } from "lucide-react"; // Changed ChevronRight to ChevronDown
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible" // Import Collapsible

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"; // Import Link for submenus

// CSS Variables for Widths
const SIDEBAR_WIDTH = "14rem"; // Default width
const SIDEBAR_WIDTH_ICON = "3.5rem"; // Width when collapsed
const SIDEBAR_WIDTH_MOBILE = "18rem"

type SidebarVariant = "sidebar" | "floating" | "inset";

type SidebarContext = {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  side: "left" | "right"
  variant: SidebarVariant;
  collapsible: 'none' | 'button' | 'icon'; // Add collapsible type
  collapsed: boolean; // Add collapsed state
  setCollapsed: (collapsed: boolean) => void; // Add setter for collapsed state
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: SidebarVariant
    collapsible?: 'none' | 'button' | 'icon'; // Prop for collapsible mode
    defaultCollapsed?: boolean; // Prop for initial collapsed state on desktop
    onCollapseChange?: (collapsed: boolean) => void; // Callback for collapse change
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = 'none', // Default to no collapsing
      defaultCollapsed = false,
      onCollapseChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    // Use defaultCollapsed only if collapsible is enabled
    const initialCollapsed = collapsible !== 'none' ? defaultCollapsed : false;
    const [collapsed, setCollapsedInternal] = React.useState(initialCollapsed);

     // Handle collapse state change internally and call the callback
    const setCollapsed = React.useCallback(
      (newCollapsedState: boolean) => {
        // Only allow collapsing on desktop if collapsible is enabled
        if (!isMobile && collapsible !== 'none') {
          setCollapsedInternal(newCollapsedState);
          onCollapseChange?.(newCollapsedState);
        }
      },
      [isMobile, collapsible, onCollapseChange]
    );

    // Reset collapsed state when switching between mobile and desktop
    React.useEffect(() => {
      if (isMobile) {
        setCollapsedInternal(false); // Always expanded on mobile sheet
        onCollapseChange?.(false);
      } else {
        // Reset to initial state for desktop, respecting collapsible setting
        const desktopInitialCollapsed = collapsible !== 'none' ? defaultCollapsed : false;
        setCollapsedInternal(desktopInitialCollapsed);
        onCollapseChange?.(desktopInitialCollapsed);
      }
    }, [isMobile, defaultCollapsed, collapsible, onCollapseChange]);

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        openMobile,
        setOpenMobile,
        isMobile,
        side,
        variant,
        collapsible,
        // Ensure collapsed is false if collapsible is 'none' or on mobile
        collapsed: isMobile || collapsible === 'none' ? false : collapsed,
        setCollapsed,
      }),
      [ openMobile, setOpenMobile, isMobile, side, variant, collapsible, collapsed, setCollapsed]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          {/* group/sidebar-wrapper is useful for structure */}
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                 "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              variant === 'inset' && 'bg-sidebar',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, openMobile, setOpenMobile, side, variant, collapsible, collapsed } = useSidebar()

    // Mobile Offcanvas Logic
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[var(--sidebar-width-mobile)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

     // Desktop - Fixed or Collapsible
    return (
      <div
        ref={ref}
        data-collapsed={collapsed} // Add data attribute for state
        data-collapsible={collapsible !== 'none'} // Data attribute for styling based on collapsibility
        className={cn(
            "group/sidebar peer relative hidden md:block text-sidebar-foreground transition-[width] duration-300 ease-in-out",
             "w-[var(--sidebar-width)]", //set width to sidebar width for default
             collapsible !== 'none' && collapsed ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]", // Dynamic width if collapsible
             collapsible === 'none' && "w-[var(--sidebar-width)]", // Fixed width if not collapsible
             (variant === "floating" || variant === "inset") && "p-2",
             side === 'left' ? 'left-0' : 'right-0',
             variant === 'sidebar' ? (side === 'left' ? 'border-r' : 'border-l') : '',
             variant === "floating" && "rounded-lg border border-sidebar-border shadow",
             className
            )}
        data-variant={variant}
        data-side={side}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
              "relative flex h-svh w-full flex-col bg-sidebar overflow-y-auto overflow-x-hidden", // Enable vertical scroll, hide horizontal
              variant === 'inset' && 'rounded-xl',
              variant === 'floating' && 'rounded-lg border border-sidebar-border shadow'
            )}
        >
          {children}
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

// SidebarTrigger remains the same (only for mobile)
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { setOpenMobile, isMobile } = useSidebar()

  if (!isMobile) return null;

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 md:hidden", className)}
      onClick={(event) => {
        onClick?.(event)
        setOpenMobile(true);
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Open Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// SidebarCollapseButton - Handles desktop collapse/expand
const SidebarCollapseButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button> & { tooltip?: string }
>(({ className, tooltip, onClick, ...props }, ref) => {
  const { collapsible, collapsed, setCollapsed, side, isMobile, variant } = useSidebar(); // Added variant

  // Return null if not collapsible on desktop or if on mobile
  if (collapsible === 'none' || isMobile) {
    return null;
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const CollapseIcon = side === 'left' ? ChevronLeft : ChevronDown; // Use ChevronDown for right side collapse
  const ExpandIcon = side === 'left' ? ChevronDown : ChevronLeft; // Use ChevronDown for right side expand

  const button = (
    <Button
      ref={ref}
      data-sidebar="collapse-button"
      variant="ghost"
      size="icon"
      className={cn(
        'absolute z-10 h-7 w-7 group-data-[collapsible=icon]/sidebar:opacity-0 group-hover/sidebar:opacity-100 group-data-[collapsible=icon]/sidebar:group-hover/sidebar:opacity-100 transition-opacity duration-200 ease-in-out',
         // Positioning based on side and state
         'top-[calc(50%_-_theme(spacing.8))]', // Vertically center
         // Adjust horizontal position based on side, collapsed state, and variant
         side === 'left' ? (
             collapsed ?
                 (variant === 'floating' || variant === 'inset' ? 'right-0 translate-x-[125%]' : 'right-0 translate-x-1/2') // More outside for floating/inset when collapsed
                 : 'right-0 translate-x-1/2' // Standard position when expanded
         ) : ( // Right side
             collapsed ?
                 (variant === 'floating' || variant === 'inset' ? 'left-0 -translate-x-[125%]' : 'left-0 -translate-x-1/2') // More outside for floating/inset when collapsed
                 : 'left-0 -translate-x-1/2' // Standard position when expanded
         ),
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {collapsed ? <ExpandIcon /> : <CollapseIcon />}
      <span className="sr-only">{collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
    </Button>
  );

  const tooltipContent = collapsed
    ? tooltip ?? 'Expand Sidebar'
    : tooltip ?? 'Collapse Sidebar';

  return (
     <Tooltip>
       <TooltipTrigger asChild>{button}</TooltipTrigger>
       <TooltipContent side={side === 'left' ? 'right' : 'left'} align="center">
         {tooltipContent}
       </TooltipContent>
     </Tooltip>
  );
});
SidebarCollapseButton.displayName = "SidebarCollapseButton";


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
   const { variant, side, collapsible, collapsed } = useSidebar();

   // Calculate margin based on state and configuration
   const marginClass = React.useMemo(() => {
      if (collapsible !== 'none') {
          // Collapsible sidebar
          if (side === 'left') {
              return collapsed ? 'md:ml-[var(--sidebar-width-icon)]' : 'md:ml-[var(--sidebar-width)]';
          } else { // side === 'right'
              return collapsed ? 'md:mr-[var(--sidebar-width-icon)]' : 'md:mr-[var(--sidebar-width)]';
          }
      } else {
          // Non-collapsible sidebar (always uses full width)
          if (side === 'left') {
              return 'md:ml-[var(--sidebar-width)]';
          } else { // side === 'right'
              return 'md:mr-[var(--sidebar-width)]';
          }
      }
   }, [side, collapsed, collapsible]);


   const insetMarginClass = React.useMemo(() => {
    if (variant !== 'inset') return '';
      if (collapsible !== 'none') {
          if (side === 'left') {
              return collapsed ? 'md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:ml-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]';
          } else { // side === 'right'
              return collapsed ? 'md:mr-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:mr-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]';
          }
      } else {
           if (side === 'left') {
               return 'md:ml-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]';
           } else { // side === 'right'
               return 'md:mr-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]';
           }
      }
   }, [side, collapsed, collapsible, variant]);


  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background transition-[margin] duration-300 ease-in-out", // Add transition for margin
        variant === "inset" ? "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow" : "",
         variant === 'inset' ? insetMarginClass : marginClass, // Apply calculated margin
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar();
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsible !== 'none' && collapsed ? "px-2" : "px-3 border-input", // Adjust padding when collapsed
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
          "flex flex-col gap-2 p-2 relative",
          collapsible !== 'none' && collapsed ? "items-center" : "items-start", // Center items when collapsed
          className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    const { collapsed, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
          "flex flex-col gap-2 p-2 mt-auto", // Ensure footer stays at the bottom
          collapsible !== 'none' && collapsed ? "items-center" : "items-start", // Center items when collapsed
          className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
    const { collapsed, collapsible } = useSidebar();
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "w-full bg-sidebar-border",
        collapsible !== 'none' && collapsed ? "mx-auto w-[80%]" : "mx-2", // Center and shrink when collapsed
        className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
         collapsible !== 'none' && collapsed ? "items-center px-1" : "p-2", // Adjust padding and alignment when collapsed
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
   const { collapsed, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col",
        collapsible !== 'none' && collapsed ? "p-1 items-center" : "p-2", // Adjust padding and alignment when collapsed
        className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  const { collapsed, collapsible } = useSidebar();
  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0",
         collapsible !== 'none' && collapsed ? "justify-center opacity-0 w-0 h-0 p-0 m-0 pointer-events-none" : "opacity-100", // Hide text when collapsed
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const { collapsed, collapsible } = useSidebar();
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-1 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
         collapsible !== 'none' && collapsed ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/sidebar-group:opacity-100", // Hide action when collapsed or show on group hover
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
   "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding,background-color,color] duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
  {
    variants: {
      size: {
        default: "h-9 text-sm", // Adjusted height
        sm: "h-8 text-xs", // Adjusted height
        lg: "h-11 text-sm", // Adjusted height
        icon: "h-9 w-9 aspect-square", // Icon-only size
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)


const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
    size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
  }
>(
  (
    {
      asChild = false,
      isActive = false,
      size: sizeProp, // Rename prop to avoid conflict
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, side, collapsed, collapsible } = useSidebar()

    // Determine actual size based on prop and collapsed state
     const size = collapsible !== 'none' && collapsed ? 'icon' : (sizeProp || 'default');

    // Tooltip logic - Show tooltip if collapsed or explicitly provided on desktop
    const tooltipContent = React.useMemo(() => {
       // Always show tooltip on mobile if provided
       if (isMobile && tooltip) {
          return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
       }
       // Show tooltip on desktop if collapsed or explicitly provided
       if (!isMobile && (collapsed || tooltip)) {
         const defaultText = typeof children === 'string' ? children : undefined;
         const content = tooltip ?? defaultText;
         if (!content) return undefined; // Don't show if no content can be determined
         return typeof content === 'string' ? { children: content } : content;
       }
       return undefined;
     }, [tooltip, collapsed, isMobile, children]);


     // Determine if the text part of the children should be hidden
    const hideText = collapsible !== 'none' && collapsed && !isMobile;

     // Filter out non-ReactNode children (like strings) when hiding text
    const filteredChildren = React.useMemo(() => {
        if (!hideText) return children;
        return React.Children.map(children, child => {
            // Keep only React elements (like icons)
            if (React.isValidElement(child)) {
                return child;
            }
            return null; // Remove text nodes etc.
        });
    }, [children, hideText]);

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ size }),
          collapsible !== 'none' && collapsed && 'justify-center', // Center icon when collapsed
          className
        )}
        {...props}
      >
         {filteredChildren}
      </Comp>
    )

    // Show tooltip if content is available
    if (!tooltipContent) {
      return button
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side={side === 'left' ? 'right' : 'left'} // Adjust tooltip side based on sidebar side
          align="center"
          {...tooltipContent}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const { collapsed, collapsible } = useSidebar();
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
         // Visibility logic
         collapsible !== 'none' && collapsed ? "opacity-0 pointer-events-none" // Hide completely when collapsed
           : (showOnHover ? "md:opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100" : "opacity-100"),
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
   const { collapsed, collapsible } = useSidebar();
  return (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
       collapsible !== 'none' && collapsed ? "opacity-0 scale-0 pointer-events-none" : "opacity-100 scale-100", // Hide badge when collapsed
      className
    )}
    {...props}
  />
)})
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = true, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar();
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
          "rounded-md h-8 flex gap-2 items-center",
          collapsible !== 'none' && collapsed ? 'justify-center px-1' : 'justify-start px-2', // Adjust alignment when collapsed
          className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md shrink-0"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      {/* Text skeleton - Hide when collapsed */}
      {!(collapsible !== 'none' && collapsed) && (
          <Skeleton
              className="h-4 flex-1 max-w-[--skeleton-width]"
              data-sidebar="menu-skeleton-text"
              style={
                {
                  "--skeleton-width": width,
                } as React.CSSProperties
              }
           />
      )}
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"


// --- Submenu Components ---

const SidebarMenuSub = CollapsiblePrimitive.Root;
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger> & {
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
    size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
    asChild?: boolean;
  }
>(({ asChild = false, isActive, tooltip, size: sizeProp, className, children, ...props }, ref) => {
   const Comp = asChild ? Slot : CollapsiblePrimitive.CollapsibleTrigger;
   const { isMobile, side, collapsed, collapsible } = useSidebar();
   const buttonRef = React.useRef<HTMLButtonElement>(null); // Ref for the button inside if needed

   // Combine refs if necessary
   const combinedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      // @ts-ignore - ref type mismatch
      if (typeof ref === 'function') ref(node);
      // @ts-ignore - ref type mismatch
      else if (ref) ref.current = node;
      buttonRef.current = node;
    },
    [ref]
  );

   // Determine actual size based on prop and collapsed state
   const size = collapsible !== 'none' && collapsed ? 'icon' : (sizeProp || 'default');

   // Tooltip logic - Show tooltip if collapsed or explicitly provided on desktop
   const tooltipContent = React.useMemo(() => {
      if (isMobile && tooltip) {
         return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
      }
      if (!isMobile && (collapsed || tooltip)) {
         const defaultText = typeof children === 'string' ? children : undefined;
         const content = tooltip ?? defaultText;
         if (!content) return undefined;
         return typeof content === 'string' ? { children: content } : content;
      }
      return undefined;
   }, [tooltip, collapsed, isMobile, children]);

   // Determine if the text part of the children should be hidden
   const hideText = collapsible !== 'none' && collapsed && !isMobile;

   // Filter out non-ReactNode children (like strings) when hiding text
   const filteredChildren = React.useMemo(() => {
       if (!hideText) return children;
       return React.Children.map(children, child => {
           if (React.isValidElement(child)) {
               return child;
           }
           return null;
       });
   }, [children, hideText]);

   const triggerElement = (
      <Comp
         ref={combinedRef}
         data-sidebar="menu-button" // Use same data attribute for consistent styling
         data-size={size}
         data-active={isActive}
         className={cn(
            sidebarMenuButtonVariants({ size }),
            collapsible !== 'none' && collapsed && 'justify-center',
            className
         )}
         {...props}
      >
         {filteredChildren}
      </Comp>
   );

   if (!tooltipContent) {
     return triggerElement;
   }

   return (
     <Tooltip>
       <TooltipTrigger asChild>{triggerElement}</TooltipTrigger>
       <TooltipContent
         side={side === 'left' ? 'right' : 'left'}
         align="center"
         {...tooltipContent}
       />
     </Tooltip>
   );
});
SidebarMenuSubTrigger.displayName = "SidebarMenuSubTrigger";


const SidebarMenuSubContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar();

  // Render null if the sidebar is collapsed and non-collapsible submenus aren't desired
  // if (collapsible !== 'none' && collapsed) {
  //   return null; // Original behavior: hide submenu content when sidebar is collapsed
  // }

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      className={cn(
        "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        // Conditional rendering/styling for collapsed state can be added here if needed
        // For example, to make submenus pop out instead of indenting when collapsed:
        // collapsed ? "absolute left-full top-0 ml-2 z-50 bg-sidebar border rounded-md shadow-md p-1" : "pl-6",
        className
      )}
      {...props}
    >
      {/* Adjust padding based on collapsed state if needed */}
      <ul className={cn("flex flex-col gap-1 py-1", collapsed ? "px-0" : "pl-6 pr-2")}>{children}</ul>
    </CollapsiblePrimitive.CollapsibleContent>
  );
});
SidebarMenuSubContent.displayName = "SidebarMenuSubContent";



export {
  Sidebar,
  SidebarCollapseButton, // Export the collapse button
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub, // Export submenu components
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
