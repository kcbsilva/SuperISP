// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import type { VariantProps} from "class-variance-authority";
import { cva } from "class-variance-authority"
import { PanelLeft, ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react"; // Renamed ChevronRight
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

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
import Link from "next/link";

// CSS Variables for Widths
const SIDEBAR_WIDTH = "13rem"; // Default width, reduced
const SIDEBAR_WIDTH_ICON = "3rem"; // Width when collapsed, reduced
const SIDEBAR_WIDTH_MOBILE = "16rem" // Reduced

type SidebarVariant = "sidebar" | "floating" | "inset";

type SidebarContext = {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  side: "left" | "right"
  variant: SidebarVariant;
  collapsible: 'none'; // Always 'none'
  collapsed: boolean; // Will always be false due to collapsible='none'
  setCollapsed: (collapsed: boolean) => void;
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
    // collapsible prop is fixed to 'none'
    onCollapseChange?: (collapsed: boolean) => void; // Kept for API consistency, though collapse won't happen
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      // collapsible is now fixed to 'none'
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
    // Since collapsible is 'none', collapsed is always false.
    const collapsed = false;
    const setCollapsed = (_newCollapsedState: boolean) => {
        // This function effectively does nothing as collapsing is disabled.
        // onCollapseChange might still be called if needed for external logic,
        // but visually the sidebar will not collapse.
        onCollapseChange?.(false); // Always report as not collapsed
    };


    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        openMobile,
        setOpenMobile,
        isMobile,
        side,
        variant,
        collapsible: 'none', // Fixed to 'none'
        collapsed: false,    // Always false
        setCollapsed,
      }),
      [ openMobile, setOpenMobile, isMobile, side, variant, /*collapsible, collapsed,*/ setCollapsed] // collapsible and collapsed removed from deps as they are fixed
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                // "--sidebar-width-icon" is no longer relevant as it won't collapse to icon-only
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
    const { isMobile, openMobile, setOpenMobile, side, variant, collapsible } = useSidebar()
    // `collapsed` state is removed as it's always false with collapsible='none'

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

    return (
      <div
        ref={ref}
        data-collapsed={false} // Always false
        data-collapsible={false} // collapsible is 'none'
        className={cn(
            "group/sidebar peer relative hidden md:block text-sidebar-foreground",
             "w-[var(--sidebar-width)]", // Always use full width
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
              "relative flex h-svh w-full flex-col bg-sidebar overflow-y-auto overflow-x-hidden",
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
      <PanelLeft className="size-3" />
      <span className="sr-only">Open Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main"> & { noMargin?: boolean }
>(({ className, noMargin, ...props }, ref) => {
   const { side, variant } = useSidebar();
   // Since sidebar is not collapsible, inset margin is always based on full sidebar width

   const marginClass = React.useMemo(() => {
      if (noMargin) return '';
      // Apply margin based on sidebar side, assuming full width
     return 'md:ml-5';
   }, [side, variant, noMargin]);


  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        marginClass, // This will be md:ml-[var(--sidebar-width)] or md:mr-[var(--sidebar-width)]
        variant === "inset" && "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
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
  // Collapsed state is not relevant here as it's always false
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "px-3 border-input", // Always show text input styling
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
  // Collapsed state is not relevant
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
          "flex flex-col gap-2 p-2 relative",
          "items-start", // Always align items to start
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
  // Collapsed state is not relevant
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
          "flex flex-col gap-2 p-2 mt-auto",
          "items-start", // Always align items to start
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
  // Collapsed state is not relevant
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "w-full bg-sidebar-border",
        "mx-2", // Always apply margin
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
  // Collapsed state is not relevant
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
         "p-2", // Always apply padding
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
  // Collapsed state is not relevant
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col",
        "p-2", // Always apply padding
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
  // Collapsed state is not relevant
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring [&>svg]:size-3 [&>svg]:shrink-0",
        "opacity-100", // Always visible
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
  // Collapsed state is not relevant
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-1 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-3 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "opacity-0 group-hover/sidebar-group:opacity-100", // Keep hover behavior
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
    className={cn("w-full text-xs", className)}
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
   "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-xs outline-none ring-sidebar-ring transition-[background-color,color] duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground", // Removed width,height,padding from transition
  {
    variants: {
      size: {
        default: "h-8 text-xs",
        sm: "h-7 text-xs",
        lg: "h-9 text-xs",
        icon: "h-8 w-8 aspect-square", // This variant won't be used if not collapsible to icon
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
      size: sizeProp,
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, side } = useSidebar()
    // Since collapsible is 'none', `hideText` is always false for desktop
    const hideText = false; // Simplified: always show text on desktop
    const size = sizeProp || 'default'; // Size is now just based on prop or default

    const tooltipContent = React.useMemo(() => {
       // Tooltip only makes sense for icon-only state, which is now disabled for desktop
       if (isMobile && tooltip) {
          return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
       }
       return undefined; // No tooltip on desktop as it's not icon-only
     }, [tooltip, isMobile]);

    const buttonChildren = React.Children.toArray(children).length > 1 ? (
      <span className={cn("flex items-center gap-2", hideText && "justify-center")}>
        {children}
      </span>
    ) : (
      children
    );

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ size }),
          className
         )}
        {...props}
      >
         {buttonChildren}
      </Comp>
    )

    if (!tooltipContent) {
      return button
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side={side === 'left' ? 'right' : 'left'}
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
  // Collapsed state is not relevant
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-3 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        showOnHover ? "md:opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100" : "opacity-100", // Opacity logic simplified
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
  // Collapsed state is not relevant
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
      "opacity-100 scale-100", // Always visible and full scale
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
  // Collapsed state is not relevant
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
          "rounded-md h-8 flex gap-2 items-center",
          "justify-start px-2", // Always justify start and apply padding
          className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-3 rounded-md shrink-0"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      {/* Text skeleton always shown */}
        <Skeleton
          className="h-4 flex-1 max-w-[--skeleton-width]"
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
   const { isMobile, side } = useSidebar();
   const buttonRef = React.useRef<HTMLButtonElement>(null);

   const combinedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      if (typeof ref === 'function') ref(node);
      // @ts-ignore // Original comment: This is a hack to get around the fact that CollapsibleTrigger doesn't accept a ref
      else if (ref) ref.current = node;
      buttonRef.current = node;
    },
    [ref]
  );

   // `hideText` is always false for desktop since collapsible is 'none'
   const hideText = false;
   const size = sizeProp || 'default';

   const tooltipContent = React.useMemo(() => {
      if (isMobile && tooltip) {
         return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
      }
      // No tooltip on desktop as sidebar is not icon-only
      return undefined;
   }, [tooltip, isMobile]);

    const filteredChildren = React.Children.toArray(children).length > 1 ? (
      <span className={cn("flex items-center gap-2", hideText && "justify-center")}>
        {children}
      </span>
    ) : (
      children
    );


   const triggerElement = (
      <Comp
         ref={combinedRef}
         data-sidebar="menu-button" // Re-use menu-button styles
         data-size={size}
         data-active={isActive}
         className={cn(
            sidebarMenuButtonVariants({ size }), // Use the same variants
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
  // `hideText` is always false for desktop

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      className={cn(
        "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
      {...props}
    >
      <ul className={cn("flex flex-col gap-1 py-1", "pl-6 pr-2")}>{children}</ul> {/* Always use padding for expanded view */}
    </CollapsiblePrimitive.CollapsibleContent>
  );
});
SidebarMenuSubContent.displayName = "SidebarMenuSubContent";



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
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
