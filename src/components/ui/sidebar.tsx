// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { ChevronLeft, ChevronRight, PanelLeft } from "lucide-react"; // Add Chevron icons

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
const SIDEBAR_WIDTH = "14rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"

type SidebarVariant = "sidebar" | "floating" | "inset";

type SidebarContext = {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  collapsed: boolean // Add collapsed state back
  setCollapsed: (collapsed: boolean) => void // Add setter
  toggleSidebar: () => void // Add toggle function
  isMobile: boolean
  side: "left" | "right"
  collapsible: "offcanvas" | "icon" | "none"
  variant: SidebarVariant;
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
    collapsible?: "offcanvas" | "icon" | "none"
    variant?: SidebarVariant
    defaultCollapsed?: boolean // Add defaultCollapsed prop
  }
>(
  (
    {
      side = "left",
      collapsible: collapsibleProp = "icon",
      variant = "sidebar",
      className,
      style,
      children,
      defaultCollapsed = false, // Default to expanded
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [collapsed, setCollapsed] = React.useState(
      collapsibleProp === "icon" ? defaultCollapsed : false // Initialize based on default and type
    );

    // Determine actual collapsible behavior based on device
    const collapsible = isMobile ? 'offcanvas' : collapsibleProp;

    // Toggle function
    const toggleSidebar = React.useCallback(() => {
       if (collapsible === 'icon') {
           setCollapsed(prev => !prev);
       }
    }, [collapsible]);

    // Reset collapsed state if collapsible type changes or on mobile
    React.useEffect(() => {
        if (collapsible === 'none') {
            setCollapsed(false);
        } else if (isMobile) {
            setCollapsed(false); // Always expanded on mobile sheet
        } else if (collapsible === 'icon'){
            setCollapsed(defaultCollapsed); // Respect default on desktop icon mode
        }
    }, [collapsible, isMobile, defaultCollapsed]);


    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        openMobile,
        setOpenMobile,
        collapsed, // Pass state
        setCollapsed, // Pass setter
        toggleSidebar, // Pass toggle function
        isMobile,
        side,
        collapsible,
        variant,
      }),
      [ openMobile, setOpenMobile, collapsed, setCollapsed, toggleSidebar, isMobile, side, collapsible, variant]
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
    const { isMobile, openMobile, setOpenMobile, side, collapsible, variant, collapsed } = useSidebar()

    // Mobile Offcanvas Logic (remains the same)
    if (isMobile && collapsible === 'offcanvas') {
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

     // Desktop - Collapsible or Fixed Width
    return (
      <div
        ref={ref}
        data-collapsed={collapsed} // Add data attribute for state
        className={cn(
            "group/sidebar peer relative hidden md:block text-sidebar-foreground transition-[width] duration-300 ease-in-out", // Add transition
            collapsed ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]", // Dynamic width
            collapsible === 'none' && "w-[var(--sidebar-width)]", // Handle non-collapsible case
            (variant === "floating" || variant === "inset") && "p-2",
            side === 'left' ? 'left-0' : 'right-0',
            variant === 'sidebar' ? (side === 'left' ? 'border-r' : 'border-l') : '',
            variant === "floating" && "rounded-lg border border-sidebar-border shadow",
            className
            )}
        data-variant={variant}
        data-side={side}
        data-collapsible={collapsible === 'icon' ? 'icon' : 'none'}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
              "relative flex h-svh w-full flex-col bg-sidebar overflow-hidden",
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

// SidebarCollapseButton (Restored)
const SidebarCollapseButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { collapsed, toggleSidebar, side, collapsible, isMobile, variant } = useSidebar()

  if (collapsible !== 'icon' || isMobile) {
    return null; // Don't render if not icon collapsible or on mobile
  }

  const Icon = side === 'left' ? (collapsed ? ChevronRight : ChevronLeft) : (collapsed ? ChevronLeft : ChevronRight);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "absolute z-10 hidden md:flex",
        // Positioning based on side and state
        side === 'left' && collapsed && 'right-0 translate-x-full',
        side === 'left' && !collapsed && 'right-0 -translate-x-0', // Adjusted for direct border positioning
        side === 'right' && collapsed && 'left-0 -translate-x-full',
        side === 'right' && !collapsed && 'left-0 translate-x-0', // Adjusted
        // Top position and centering vertically
        'bottom-2 top-auto transform', // Use bottom positioning
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <Icon className="size-4" />
    </Button>
  )
})
SidebarCollapseButton.displayName = "SidebarCollapseButton"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
   const { collapsible, variant, side, collapsed } = useSidebar();

  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background transition-[margin] duration-300 ease-in-out", // Add transition
        variant === "inset" ? "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow" : "",
         // Apply margin based on collapsed state and side
         collapsible === 'icon' && side === 'left' && (
             collapsed ?
             (variant === 'inset' ? 'md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:ml-[var(--sidebar-width-icon)]') :
             (variant === 'inset' ? 'md:ml-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]' : 'md:ml-[var(--sidebar-width)]')
         ),
         collapsible === 'icon' && side === 'right' && (
            collapsed ?
            (variant === 'inset' ? 'md:mr-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:mr-[var(--sidebar-width-icon)]') :
            (variant === 'inset' ? 'md:mr-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]' : 'md:mr-[var(--sidebar-width)]')
         ),
          // Apply full width margin if sidebar is not collapsible icon type
          collapsible !== 'icon' && side === 'left' && (variant === 'inset' ? 'md:ml-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]' : 'md:ml-[var(--sidebar-width)]'),
          collapsible !== 'icon' && side === 'right' && (variant === 'inset' ? 'md:mr-[calc(var(--sidebar-width)_+_theme(spacing.4)_+2px)]' : 'md:mr-[var(--sidebar-width)]'),

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
  const { collapsed } = useSidebar()
  // Input visibility and style depends on collapsed state
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsed
          ? "px-0 border-transparent focus:px-3 focus:border-input" // Collapsed state styles
          : "px-3 border-input", // Expanded state styles
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
  const { collapsed } = useSidebar()
  // Align items based on collapsed state
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
          "flex flex-col gap-2 p-2 relative",
          collapsed ? "items-center" : "items-start", // Center when collapsed, start when expanded
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
  const { collapsed } = useSidebar()
   // Align items based on collapsed state
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
          "flex flex-col gap-2 p-2 mt-auto",
          collapsed ? "items-center" : "items-start", // Center when collapsed, start when expanded
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
  const { collapsed } = useSidebar()
   // Adjust margin based on collapsed state
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "w-full bg-sidebar-border",
        collapsed ? "mx-0" : "mx-2", // Adjust margin
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
  const { collapsed } = useSidebar()
  // Adjust padding and scrollbar visibility based on collapsed state
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
         collapsed ? "p-0" : "p-2", // Adjust padding
         collapsed ? "scrollbar-hide" : "", // Hide scrollbar only when collapsed
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
  const { collapsed } = useSidebar()
   // Adjust padding based on collapsed state
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col",
        collapsed ? "p-0" : "p-2", // Adjust padding
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
  const { collapsed } = useSidebar()
  // Label visibility based on collapsed state
  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0",
        collapsed ? "opacity-0" : "opacity-100", // Hide when collapsed
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
  const { collapsed } = useSidebar()
  // Action visibility based on collapsed state and hover
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-1 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        collapsed
          ? "opacity-0 group-hover/sidebar-group:opacity-100" // Show on group hover when collapsed
          : "opacity-0 group-hover/sidebar-group:opacity-100", // Show on group hover when expanded
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
   "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
  {
    variants: {
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
        icon: "size-8 p-2 justify-center" // Use for collapsed state
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
    const { collapsed, isMobile, side } = useSidebar()

    // Determine actual size based on collapsed state and prop
    const size = collapsed ? 'icon' : sizeProp || 'default';

    // Tooltip logic
    const tooltipContent = React.useMemo(() => {
        // Only show tooltip when collapsed or if explicitly provided
       if (!collapsed && !tooltip) return undefined;

       if (tooltip) {
         return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
       }

       let textContent = '';
        // Extract text content from children (simplified)
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.type === 'span') {
                textContent += React.Children.toArray(child.props.children).join('');
            } else if (typeof child === 'string') {
                textContent += child;
            } else if (React.isValidElement(child) && child.type === Link) {
                 React.Children.forEach(child.props.children, (grandChild) => {
                    if (React.isValidElement(grandChild) && grandChild.type === 'span') {
                        textContent += React.Children.toArray(grandChild.props.children).join('');
                    } else if (typeof grandChild === 'string') {
                        textContent += grandChild;
                    }
                 });
            }
        });
        return textContent ? { children: textContent.trim() } : undefined;
     }, [tooltip, children, collapsed]);

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ size }),
          collapsed && 'justify-center', // Center content when collapsed
          className
        )}
        {...props}
      >
         {/* Conditionally hide text span when collapsed */}
         {React.Children.map(children, child => {
             if (React.isValidElement(child) && child.type === 'span') {
                 return React.cloneElement(child, {
                     className: cn(child.props.className, collapsed && 'hidden')
                 });
             }
             return child;
         })}
      </Comp>
    )

    // Show tooltip only on desktop when collapsed or explicitly provided
    if (isMobile || !tooltipContent) {
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
  const { collapsed } = useSidebar()
  // Action visibility depends on collapsed state and hover
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
        collapsed ? "opacity-0" : (showOnHover ? "md:opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100" : "opacity-100"),
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
   const { collapsed } = useSidebar()
  // Badge visibility based on collapsed state
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
      collapsed ? "opacity-0" : "opacity-100", // Hide when collapsed
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
  const { collapsed } = useSidebar()
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
          "rounded-md h-8 flex gap-2 items-center",
          collapsed ? 'justify-center' : 'justify-start px-2', // Center or align start based on state
          className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md shrink-0"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      {/* Text skeleton visibility based on collapsed state */}
      {!collapsed && (
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

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  const { collapsed, side } = useSidebar()
  // Submenu visibility logic remains similar, positions based on side
  return (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      // Base styling
      "absolute top-0 z-10 hidden w-[var(--sidebar-width)] min-w-max flex-col gap-1 rounded-md border bg-sidebar p-1 shadow-md",
      // Positioning based on side
      side === 'left' ? 'left-full ml-1' : 'right-full mr-1',
      // Show on hover/focus of parent menu item
      "group-hover/menu-item:flex group-focus-within/menu-item:flex",
       // Hide if the main sidebar is expanded (only show submenu when collapsed)
       !collapsed && 'md:hidden',
      className
    )}
    {...props}
  />
)})
SidebarMenuSub.displayName = "SidebarMenuSub"


const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"
  // Sub-button styling remains the same
  return (
     <Comp
       ref={ref}
       data-sidebar="menu-sub-button"
       data-size={size}
       data-active={isActive}
       className={cn(
         "flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
         "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
         size === "sm" && "text-xs",
         size === "md" && "text-sm",
         className
       )}
       {...props}
     >
        {children}
    </Comp>
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarCollapseButton, // Export collapse button
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
