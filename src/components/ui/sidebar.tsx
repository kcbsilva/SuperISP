// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, PanelLeftClose, PanelRightClose } from "lucide-react" // Import necessary icons

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

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "14rem" // Reduced from 16rem
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  side: "left" | "right" // Add side to context
  collapsible: "offcanvas" | "icon" | "none" // Add collapsible to context
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
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    side?: "left" | "right" // Accept side prop
    collapsible?: "offcanvas" | "icon" | "none" // Accept collapsible prop
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      side = "left", // Default side
      collapsible = "icon", // Default collapsible
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // Initialize state from cookie if available, otherwise use defaultOpen
    const getInitialOpenState = () => {
      // Don't use cookie state for mobile offcanvas
      if (isMobile && collapsible === "offcanvas") return false;
      if (typeof window !== 'undefined') {
        const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
          ?.split('=')[1];
        if (cookieValue) {
          return cookieValue === 'true';
        }
      }
      return defaultOpen;
    };

    const [_open, _setOpen] = React.useState(getInitialOpenState);

    // Re-evaluate initial state if mobile status or collapsible type changes
    React.useEffect(() => {
      _setOpen(getInitialOpenState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, collapsible]);


    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        // Don't control open state externally for mobile offcanvas
        if (isMobile && collapsible === "offcanvas") return;

        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        if (typeof window !== 'undefined' && collapsible !== "offcanvas") { // Only save cookie if not offcanvas
           document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        }
      },
      [setOpenProp, open, isMobile, collapsible] // Add isMobile and collapsible
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        if (collapsible === 'offcanvas') {
            setOpenMobile((open) => !open)
        }
        // No toggle for mobile icon mode, it's always collapsed
      } else {
        setOpen((open) => !open)
      }
    }, [isMobile, setOpen, setOpenMobile, collapsible])


    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = (isMobile && collapsible !== 'offcanvas') ? "collapsed" : open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        side, // Pass side
        collapsible, // Pass collapsible
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, side, collapsible]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
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
  React.ComponentProps<"div"> & {
    side?: "left" | "right" // Already here from previous step
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none" // Already here from previous step
  }
>(
  (
    {
      side: sideProp, // Rename prop to avoid conflict with context value
      variant = "sidebar",
      collapsible: collapsibleProp, // Rename prop to avoid conflict
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Use context values first, then fall back to props if needed (though props aren't expected here)
    const { isMobile, state, openMobile, setOpenMobile, side: contextSide, collapsible: contextCollapsible } = useSidebar()
    const side = sideProp ?? contextSide;
    const collapsible = collapsibleProp ?? contextCollapsible;

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    // Mobile Offcanvas Logic
    if (isMobile && collapsible === 'offcanvas') {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

     // Desktop / Mobile Icon Logic
    return (
       // Added 'relative' positioning context for the collapse button
      <div
        ref={ref}
        className="group peer relative hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        // REMOVED onMouseEnter and onMouseLeave
        // onMouseEnter={() => !isMobile && setOpen(true)}
        // onMouseLeave={() => !isMobile && setOpen(false)}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
            // Handle offcanvas correctly
            collapsible === 'offcanvas' ? "w-0" : "",
             // Handle icon mode width
            state === 'collapsed' && collapsible === 'icon' ? (variant === "floating" || variant === "inset" ? "w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "w-[--sidebar-width-icon]") : "w-[--sidebar-width]",
            "group-data-[side=right]:rotate-180", // This might not be needed if side is handled below
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
             // Position based on side
            side === "left" ? "left-0" : "right-0",
             // Handle offcanvas collapsed state
            collapsible === 'offcanvas' && state === 'collapsed' ? (side === 'left' ? "-left-[var(--sidebar-width)]" : "-right-[var(--sidebar-width)]") : "",
             // Adjust padding and width for icon mode variants
            state === 'collapsed' && collapsible === 'icon' ? (
                variant === "floating" || variant === "inset"
                    ? "w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] p-2"
                    : "w-[--sidebar-width-icon]"
            ) : "w-[--sidebar-width]",
             // Add borders for default sidebar variant when not collapsed icon mode
            !(state === 'collapsed' && collapsible === 'icon') && variant === 'sidebar' ? (side === 'left' ? 'border-r' : 'border-l') : '',
             // Adjust padding for floating/inset only when expanded
            state === 'expanded' && (variant === 'floating' || variant === 'inset') ? 'p-2' : '',
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
             // Added 'relative' positioning context for the collapse button
            className={cn("relative flex h-full w-full flex-col bg-sidebar",
               // Apply styles based on variant only when expanded
              state === 'expanded' && variant === "floating" ? "rounded-lg border border-sidebar-border shadow" : ""
            )}

          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

// New component for the collapse button
const SidebarCollapseButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggleSidebar, state, side, isMobile, collapsible } = useSidebar();

  // Don't render on mobile unless it's offcanvas mode (where it won't be visible anyway)
  // Don't render if collapsible is 'none'
  if (isMobile || collapsible === 'none') {
    return null;
  }

  const Icon = side === 'left'
    ? (state === 'expanded' ? PanelLeftClose : PanelRightClose)
    : (state === 'expanded' ? PanelRightClose : PanelLeftClose);

  const tooltipText = state === 'expanded' ? 'Collapse Sidebar' : 'Expand Sidebar';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
         {/* Button positioned absolutely relative to the Sidebar component */}
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 absolute top-2 z-20",
             // Position based on side
            side === 'left' ? 'right-2' : 'left-2',
             // Ensure button is always visible for toggling
            // state === 'collapsed' && collapsible === 'icon' ? 'hidden' : '', // Removed this line
             // Adjust position slightly when collapsed in icon mode to stay visually consistent
            state === 'collapsed' && collapsible === 'icon' ? (side === 'left' ? 'right-0.5' : 'left-0.5') : '',
            className
          )}
          onClick={toggleSidebar}
          {...props}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{tooltipText}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side === 'left' ? 'right' : 'left'}>
        {tooltipText} (Ctrl + B)
      </TooltipContent>
    </Tooltip>
  );
});
SidebarCollapseButton.displayName = "SidebarCollapseButton";


const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, collapsible } = useSidebar() // Get collapsible setting

  // Only render trigger if it's mobile offcanvas
  if (collapsible !== 'offcanvas') return null;

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 md:hidden", className)} // Ensure it's hidden on desktop
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar, state, side, collapsible } = useSidebar()

  // Do not render the rail if collapsible is 'none' or 'icon'
  if (collapsible === 'none' || collapsible === 'icon') {
    return null;
  }

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        // Cursors based on side and state
        side === 'left' ? (state === 'expanded' ? 'cursor-w-resize' : 'cursor-e-resize') : (state === 'expanded' ? 'cursor-e-resize' : 'cursor-w-resize'),
        // Offcanvas specific adjustments
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        side === 'left' && collapsible === 'offcanvas' ? "-right-2" : "",
        side === 'right' && collapsible === 'offcanvas' ? "-left-2" : "",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
   const { state, collapsible, variant, side } = useSidebar(); // Get context

  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background transition-[margin-left,margin-right] duration-200 ease-linear", // Added transition
        // Inset variant specific styles
        variant === "inset" ? "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow" : "",

        // Margin adjustments based on sidebar state, collapsible type, variant, and side
        // Apply margin only on medium screens and up (md:)
         collapsible !== 'offcanvas' && side === 'left' && (
           state === 'expanded' ? 'md:ml-[var(--sidebar-width)]' :
           collapsible === 'icon' ? (variant === 'inset' ? 'md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:ml-[var(--sidebar-width-icon)]') : ''
         ),
         collapsible !== 'offcanvas' && side === 'right' && (
             state === 'expanded' ? 'md:mr-[var(--sidebar-width)]' :
             collapsible === 'icon' ? (variant === 'inset' ? 'md:mr-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:mr-[var(--sidebar-width-icon)]') : ''
         ),
         // Specific margin for inset variant when collapsed icon mode
         collapsible === 'icon' && state === 'collapsed' && variant === 'inset' && side === 'left' ? 'md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : '',
         collapsible === 'icon' && state === 'collapsed' && variant === 'inset' && side === 'right' ? 'md:mr-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : '',


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
  const { state, collapsible } = useSidebar(); // Get state and collapsible
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        // Hide input text when collapsed in icon mode
        state === 'collapsed' && collapsible === 'icon' ? 'px-0 border-transparent focus:px-3 focus:border-input' : '',
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
   const { state, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
          "flex flex-col gap-2 p-2 relative", // Added relative positioning
          // Center content when collapsed icon mode
          state === 'collapsed' && collapsible === 'icon' ? 'items-center' : '',
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
   const { state, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
          "flex flex-col gap-2 p-2 mt-auto", // Added mt-auto
          // Center content when collapsed icon mode
           state === 'collapsed' && collapsible === 'icon' ? 'items-center' : '',
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
   const { state, collapsible } = useSidebar();
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
          "mx-2 w-auto bg-sidebar-border",
           // Make separator full width when collapsed icon mode
           state === 'collapsed' && collapsible === 'icon' ? 'mx-0' : '',
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
   const { state, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
         // Adjust padding when collapsed icon mode
         state === 'collapsed' && collapsible === 'icon' ? 'p-0' : 'p-2',
         // Hide scrollbar visually but allow scrolling when collapsed icon mode
         state === 'collapsed' && collapsible === 'icon' ? 'scrollbar-hide' : '',
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
   const { state, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
          "relative flex w-full min-w-0 flex-col p-2",
           // Remove padding when collapsed icon mode
           state === 'collapsed' && collapsible === 'icon' ? 'p-0' : '',
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
   const { state, collapsible } = useSidebar();
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
         // Hide label when collapsed icon mode
         state === 'collapsed' && collapsible === 'icon' ? 'h-0 p-0 opacity-0' : '',
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
  const { state, collapsible } = useSidebar();
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
         // Hide action when collapsed icon mode
         state === 'collapsed' && collapsible === 'icon' ? 'hidden' : '',
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
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm", // Removed icon specific styling here
      },
       // New variant for collapsed state in icon mode
      collapsed: {
        true: "[&>span:last-child]:hidden !size-8 !p-2", // Hide text, force icon size
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
       collapsed: false, // Default to not collapsed
    },
  }
)


const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
    // Remove variant props from here, apply directly in cn
  } & Omit<VariantProps<typeof sidebarMenuButtonVariants>, 'collapsed'> // Omit collapsed variant prop
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default", // Keep default variant
      size = "default", // Keep default size
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state, collapsible } = useSidebar() // Get state and collapsible

     // Determine if the button should be in collapsed state
    const isCollapsed = state === 'collapsed' && collapsible === 'icon';


     const tooltipContent = React.useMemo(() => {
       if (tooltip) {
         return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
       }
       let textContent = '';
       React.Children.forEach(children, (child) => {
         if (typeof child === 'string') {
           textContent += child;
         } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
             textContent += child.props.children;
         } else if (React.isValidElement(child)) {
             // Look for span inside other elements (like Link)
             React.Children.forEach(child.props.children, (grandChild) => {
                 if (typeof grandChild === 'string') {
                     textContent += grandChild;
                 } else if (React.isValidElement(grandChild) && grandChild.type === 'span' && typeof grandChild.props.children === 'string') {
                     textContent += grandChild.props.children;
                 }
             });
         }
       });
       return textContent ? { children: textContent.trim() } : undefined;
     }, [tooltip, children]);

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
         // Apply collapsed variant class based on state
        className={cn(sidebarMenuButtonVariants({ variant, size, collapsed: isCollapsed }), className)}
        {...props}
      >
        {/* Ensure SVG icon is always visible and sized correctly */}
        {React.Children.map(children, child => {
             if (React.isValidElement(child) && typeof child.type !== 'string' /*&& child.type.displayName?.includes('Icon')*/) {
                 // Check if it's likely an icon (e.g., has specific props or is an SVG)
                 const isIconElement = typeof child.type === 'function' || child.type === 'svg'; // Basic check
                 if (isIconElement) {
                      return React.cloneElement(child as React.ReactElement<any>, { className: cn("size-4 shrink-0", child.props.className) });
                 }
             }
             // Only render non-icon children if not collapsed
              if (!isCollapsed) {
                 return child;
              }
              return null; // Don't render text spans etc. when collapsed
          })}
      </Comp>
    )

     // Only show tooltip when collapsed in icon mode on desktop
    if (!isCollapsed || isMobile || !tooltipContent) {
      return button
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
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
  const { state, collapsible } = useSidebar();
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
         // Hide action when collapsed icon mode
         state === 'collapsed' && collapsible === 'icon' ? 'hidden' : '',
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
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
   const { state, collapsible } = useSidebar();
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
       // Hide badge when collapsed icon mode
       state === 'collapsed' && collapsible === 'icon' ? 'hidden' : '',
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
>(({ className, showIcon = false, ...props }, ref) => {
   const { state, collapsible } = useSidebar();
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
          "rounded-md h-8 flex gap-2 px-2 items-center",
           // Adjust skeleton for collapsed icon mode
           state === 'collapsed' && collapsible === 'icon' ? 'justify-center px-0' : '',
          className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
       {/* Hide text skeleton when collapsed */}
      {!(state === 'collapsed' && collapsible === 'icon') && (
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
  const { state, collapsible } = useSidebar();
  return (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
       // Hide sub-menu when collapsed icon mode
       state === 'collapsed' && collapsible === 'icon' ? 'hidden' : '',
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
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  }
>(({ asChild = false, size = "md", isActive, className, children, tooltip, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"
  const { isMobile, state, collapsible } = useSidebar() // Get state and collapsible

   const tooltipContent = React.useMemo(() => {
    if (tooltip) {
      return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
    }
    let textContent = '';
    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        textContent += child;
      } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
        textContent += child.props.children;
      }
    });
    return textContent ? { children: textContent.trim() } : undefined;
  }, [tooltip, children]);


  const button = (
     <Comp
       ref={ref}
       data-sidebar="menu-sub-button"
       data-size={size}
       data-active={isActive}
       className={cn(
         "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
         "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
         size === "sm" && "text-xs",
         size === "md" && "text-sm",
          // Hide sub-button when collapsed icon mode
          state === 'collapsed' && collapsible === 'icon' ? 'hidden' : '',
         className
       )}
       {...props}
     >
        {children}
    </Comp>
  )

   // Tooltips for sub-buttons are generally not needed/used in collapsed mode
   // but keep the logic if desired. Hidden by default due to parent being hidden.
   if (!(state === 'collapsed' && collapsible === 'icon') || isMobile || !tooltipContent) {
      return button
   }


  return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile} // Redundant check but safe
          {...tooltipContent}
        />
      </Tooltip>
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarCollapseButton, // Export the new button
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
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
