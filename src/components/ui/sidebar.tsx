// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"; // Only PanelLeft needed for mobile trigger

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

// Removed cookie constants and keyboard shortcut constant
const SIDEBAR_WIDTH = "14rem" // Still used for submenus
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem" // Fixed width

type SidebarVariant = "sidebar" | "floating" | "inset";

type SidebarContext = {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
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
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const collapsible = isMobile ? 'offcanvas' : collapsibleProp; // Still relevant for mobile/non-collapsible

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        openMobile,
        setOpenMobile,
        isMobile,
        side,
        collapsible,
        variant,
      }),
      [ openMobile, setOpenMobile, isMobile, side, collapsible, variant]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          {/* group/sidebar-wrapper is still useful for structure but not hover */}
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full", // Keep group for structure
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
    const { isMobile, openMobile, setOpenMobile, side, collapsible, variant } = useSidebar()

    // Mobile Offcanvas Logic (remains the same)
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

     // Desktop - Fixed Icon Width
    return (
      <div
        ref={ref}
        className={cn(
            "group/sidebar peer relative hidden md:block text-sidebar-foreground", // Keep peer for SidebarInset, group/sidebar for potential future use or structure
            "w-[var(--sidebar-width-icon)]", // Fixed width
            (variant === "floating" || variant === "inset") && "p-2", // Padding for floating/inset
            collapsible === 'none' && "w-[var(--sidebar-width)]", // Handle non-collapsible case (full width)
            side === 'left' ? 'left-0' : 'right-0',
            variant === 'sidebar' ? (side === 'left' ? 'border-r' : 'border-l') : '',
            variant === "floating" && "rounded-lg border border-sidebar-border shadow", // Add floating styles (no hover needed)
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
              variant === 'floating' && 'rounded-lg border border-sidebar-border shadow' // Apply floating styles (no hover needed)
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


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
   const { collapsible, variant, side } = useSidebar();

  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background", // Removed transition
        variant === "inset" ? "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow" : "",
         // Apply margin based on fixed collapsed width
         collapsible === 'icon' && side === 'left' && (
             variant === 'inset' ? 'md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:ml-[var(--sidebar-width-icon)]'
         ),
         collapsible === 'icon' && side === 'right' && (
             variant === 'inset' ? 'md:mr-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]' : 'md:mr-[var(--sidebar-width-icon)]'
         ),
          // Apply full width margin if sidebar is not collapsible icon type
          collapsible !== 'icon' && side === 'left' && 'md:ml-[var(--sidebar-width)]',
          collapsible !== 'icon' && side === 'right' && 'md:mr-[var(--sidebar-width)]',

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
  // Input is always in the collapsed state visually
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "px-0 border-transparent focus:px-3 focus:border-input", // Always collapsed state styles
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
  // Always center content
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
          "flex flex-col gap-2 p-2 relative items-center", // Always centered
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
   // Always center content
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
          "flex flex-col gap-2 p-2 mt-auto items-center", // Always centered
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
   // Always full width (in collapsed icon state)
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-0 w-full bg-sidebar-border", className)} // Fixed margin/width
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
   // Always use collapsed padding and hide scrollbar
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
         "p-0", // Always collapsed padding
         "scrollbar-hide",
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
   // Always use collapsed padding
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-0", className)} // Always collapsed padding
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
  // Label is always hidden
  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-0 shrink-0 items-center rounded-md px-0 text-xs font-medium text-sidebar-foreground/70 opacity-0 outline-none ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0", // Always hidden
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
  // Action is always hidden (or consider showing it permanently if needed)
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-1 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground opacity-0 outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", // Always hidden
        "after:absolute after:-inset-2 after:md:hidden",
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
    className={cn("group/menu-item relative", className)} // Keep group for submenu
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
        icon: "size-8 p-2 justify-center" // Always centered, fixed width/height
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
      size = "icon", // Default to icon size
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile } = useSidebar()

    // Sidebar is always visually collapsed on desktop
    const isCollapsed = !isMobile;

     const tooltipContent = React.useMemo(() => {
        if (tooltip) {
         return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
       }
       let textContent = '';
        // Simplified logic to extract text content for tooltip
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
     }, [tooltip, children]);

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ size }), className)}
        {...props}
      >
         {/* Text span is always hidden via layout.tsx or CSS */}
        {children}
      </Comp>
    )

    // Always show tooltip on desktop
    if (isMobile || !tooltipContent) {
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
  const Comp = asChild ? Slot : "button"
  // Action is always hidden unless showOnHover and parent item is hovered
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground opacity-0 outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", // Default hidden
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
         // Show only on item hover if showOnHover is true
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
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
   // Badge is always hidden
  return (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground opacity-0 select-none pointer-events-none", // Always hidden
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
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
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
          "rounded-md h-8 flex gap-2 items-center justify-center", // Always centered
          className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md shrink-0"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      {/* Text skeleton is always hidden */}
      <Skeleton
            className="h-4 flex-1 max-w-[--skeleton-width] hidden" // Always hidden
            data-sidebar="menu-skeleton-text"
            style={
              {
                "--skeleton-width": width,
              } as React.CSSProperties
            }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  // Show submenu on parent item hover/focus (logic remains the same)
  return (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      // Styling for positioning and appearance
      "absolute left-full top-0 z-10 ml-1 hidden w-[var(--sidebar-width)] min-w-max flex-col gap-1 rounded-md border bg-sidebar p-1 shadow-md",
      // Show on hover/focus of parent menu item
      "group-hover/menu-item:flex group-focus-within/menu-item:flex",
      // Removed group-hover/sidebar:hidden as sidebar doesn't expand on hover anymore
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
  // Sub-button visibility controlled by SidebarMenuSub
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
