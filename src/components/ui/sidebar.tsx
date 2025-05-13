// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import type { VariantProps} from "class-variance-authority";
import { cva } from "class-variance-authority"
import { PanelLeft, ChevronDown } from "lucide-react"; 
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils" // cn will still be useful for conditional classes
import { Button } from "@/components/ui/button" // This will need to be a Bootstrap-styled button
import { Input } from "@/components/ui/input" // This will need to be a Bootstrap-styled input
import { Separator } from "@/components/ui/separator" // This will need to be a Bootstrap-styled separator
// Sheet might need replacement if its styling is too Tailwind-dependent
import { Sheet, SheetContent } from "@/components/ui/sheet" 
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip" // Tooltip will also need Bootstrap styling or replacement


const SIDEBAR_WIDTH = "13rem"; 
const SIDEBAR_WIDTH_ICON = "3rem"; 
const SIDEBAR_WIDTH_MOBILE = "16rem"

type SidebarVariant = "sidebar" | "floating" | "inset";

type SidebarContext = {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  side: "left" | "right"
  variant: SidebarVariant;
  collapsible: 'none'; 
  collapsed: boolean; 
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
    onCollapseChange?: (collapsed: boolean) => void;
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
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
    const collapsed = false; 
    const setCollapsed = (_newCollapsedState: boolean) => {
        onCollapseChange?.(false); 
    };


    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        openMobile,
        setOpenMobile,
        isMobile,
        side,
        variant,
        collapsible: 'none', 
        collapsed: false,    
        setCollapsed,
      }),
      [ openMobile, setOpenMobile, isMobile, side, variant, setCollapsed]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                ...style,
              } as React.CSSProperties
            }
            // Use Bootstrap d-flex instead of Tailwind flex
            className={cn(
              "group-sidebar-wrapper d-flex min-vh-100 w-100", // Bootstrap flex and height
              variant === 'inset' && 'bg-light', // Example Bootstrap background
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
    const { isMobile, openMobile, setOpenMobile, side, variant } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            // Using Bootstrap classes for width and styling
            className={`w-[var(--sidebar-width-mobile)] offcanvas offcanvas-${side === 'left' ? 'start' : 'end'} bg-light text-dark p-0`}
            style={
              {
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            // `side` prop might not directly map to Bootstrap's offcanvas placement, manual class needed
          >
            <div className="d-flex flex-column h-100 w-100">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        data-collapsed={false} 
        data-collapsible={false}
        // Bootstrap classes for sidebar
        className={cn(
            "group-sidebar position-relative d-none d-md-block text-dark",
             "w-[var(--sidebar-width)]", 
             (variant === "floating" || variant === "inset") && "p-2",
             side === 'left' ? 'start-0' : 'end-0', // Bootstrap positioning
             variant === 'sidebar' ? (side === 'left' ? 'border-end' : 'border-start') : '', // Bootstrap borders
             variant === "floating" && "rounded shadow border", // Bootstrap styling
             className
            )}
        data-variant={variant}
        data-side={side}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          // Bootstrap classes for inner sidebar container
          className={cn(
              "position-relative d-flex flex-column h-100 w-100 bg-light overflow-auto",
              variant === 'inset' && 'rounded-xl', // Bootstrap rounded corners
              variant === 'floating' && 'rounded border shadow'
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
      variant="ghost" // This will need mapping to Bootstrap btn-light or similar
      size="icon" // This will need mapping to Bootstrap button sizing
      className={cn("btn btn-icon d-md-none me-2", className)} // Bootstrap classes
      onClick={(event) => {
        onClick?.(event)
        setOpenMobile(true);
      }}
      {...props}
    >
      <PanelLeft style={{width: '0.75rem', height: '0.75rem'}} /> {/* Adjust icon size if needed */}
      <span className="visually-hidden">Open Sidebar</span> {/* Bootstrap screen reader only */}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main"> & { noMargin?: boolean }
>(({ className, noMargin, ...props }, ref) => {
   const { side, variant } = useSidebar();
   const marginClass = React.useMemo(() => {
      if (noMargin) return '';
     return side === 'left' ? 'ms-md-5' : 'me-md-5'; // Bootstrap margin start/end for medium screens and up
   }, [side, noMargin]);


  return (
    <main
      ref={ref}
      // Bootstrap classes for main content area
      className={cn(
        "position-relative d-flex flex-column flex-grow-1 min-vh-100 bg-body", 
        marginClass, 
        variant === "inset" && "m-md-2 rounded-xl shadow", // Bootstrap margin, rounded, shadow
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
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      // Bootstrap form control classes
      className={cn(
        "form-control form-control-sm bg-body shadow-none", 
        "px-3",
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
  return (
    <div
      ref={ref}
      data-sidebar="header"
      // Bootstrap flex and padding
      className={cn(
          "d-flex flex-column gap-2 p-2 position-relative",
          "align-items-start", 
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
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      // Bootstrap flex, padding, margin-top auto
      className={cn(
          "d-flex flex-column gap-2 p-2 mt-auto", 
          "align-items-start",
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
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      // Bootstrap border and margin
      className={cn(
        "w-100 border-top", 
        "mx-2", 
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
  return (
    <div
      ref={ref}
      data-sidebar="content"
      // Bootstrap flex, overflow
      className={cn(
        "d-flex flex-column flex-grow-1 gap-2 overflow-auto",
         "p-2",
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
  return (
    <div
      ref={ref}
      data-sidebar="group"
      // Bootstrap flex
      className={cn(
        "position-relative d-flex flex-column w-100", 
        "p-2", 
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
  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      // Bootstrap flex, text styling
      className={cn(
        "d-flex align-items-center rounded px-2 text-xs fw-medium text-muted",
        "opacity-100",
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
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      // Bootstrap button reset, positioning, text styling
      className={cn(
        "position-absolute end-0 top-0 mt-1 me-1 btn btn-icon btn-sm text-body", // Adjusted positioning and Bootstrap classes
        "opacity-0 group-hover/sidebar-group:opacity-100", 
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
    className={cn("w-100 small", className)} // Bootstrap 'small' for text-xs equivalent
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
    // Bootstrap list reset, flex, gap
    className={cn("list-unstyled d-flex flex-column w-100 gap-1", className)} 
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
    className={cn("group-menu-item position-relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

// Replicating sidebarMenuButtonVariants with Bootstrap in mind.
// This is a conceptual mapping, exact class names might differ based on Bootstrap version.
// Bootstrap often relies on more specific component classes (`.btn`, `.nav-link`) rather than pure utility composition for complex states.
const sidebarMenuButtonBase = "btn d-flex w-100 align-items-center gap-2 overflow-hidden rounded p-2 text-start text-xs";
const sidebarMenuButtonHover = "hover:bg-secondary hover:text-white"; // Example hover
const sidebarMenuButtonActive = "active bg-primary text-white fw-medium"; // Example active

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
    size?: 'default' | 'sm' | 'lg' | 'icon'; // Simplified size
  }
>(
  (
    {
      asChild = false,
      isActive = false,
      size: sizeProp = 'default', // Default size
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, side } = useSidebar();
    const hideText = false; 

    const tooltipContent = React.useMemo(() => {
       if (isMobile && tooltip) {
          return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
       }
       return undefined; 
     }, [tooltip, isMobile]);

    const buttonChildren = React.Children.toArray(children).length > 1 ? (
      <span className={cn("d-flex align-items-center gap-2", hideText && "justify-content-center")}>
        {children}
      </span>
    ) : (
      children
    );
    
    // Construct Bootstrap class string
    let bsClasses = sidebarMenuButtonBase;
    if(size === 'sm') bsClasses += ' btn-sm';
    if(size === 'lg') bsClasses += ' btn-lg';
    if(isActive) bsClasses += ` ${sidebarMenuButtonActive}`;
    else bsClasses += ` ${sidebarMenuButtonHover} btn-light text-dark`; // Default non-active

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(bsClasses, className)}
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
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      // Bootstrap positioning and button reset
      className={cn(
        "position-absolute end-0 top-0 btn btn-icon btn-sm text-body", 
        "mt-1 me-1", // Adjust margins for positioning
        showOnHover ? "d-md-none group-focus-within/menu-item:d-md-inline-flex group-hover/menu-item:d-md-inline-flex" : "d-inline-flex",
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
  return (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    // Bootstrap badge and positioning
    className={cn(
      "position-absolute top-0 end-0 badge rounded-pill bg-danger text-white", // Example Bootstrap badge
      "mt-1 me-1", // Adjust positioning
      "opacity-100 scale-100",
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
      // Bootstrap flex, padding
      className={cn(
          "rounded p-2 d-flex gap-2 align-items-center",
          "justify-content-start",
          className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="rounded" 
          style={{width: '0.75rem', height: '0.75rem'}}
          data-sidebar="menu-skeleton-icon"
        />
      )}
        <Skeleton
          className="flex-grow-1"
          style={
            {
              height: '1rem', // Equivalent to h-4
              maxWidth: `var(--skeleton-width)`,
            } as React.CSSProperties
           }
          data-sidebar="menu-skeleton-text"
         />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"


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
      else if (ref) ref.current = node;
      buttonRef.current = node;
    },
    [ref]
  );

   const hideText = false;
   const size = sizeProp || 'default';

   const tooltipContent = React.useMemo(() => {
      if (isMobile && tooltip) {
         return typeof tooltip === 'string' ? { children: tooltip } : tooltip;
      }
      return undefined;
   }, [tooltip, isMobile]);

    const filteredChildren = React.Children.toArray(children).length > 1 ? (
      <span className={cn("d-flex align-items-center gap-2", hideText && "justify-content-center")}>
        {children}
      </span>
    ) : (
      children
    );
    
    let bsClasses = sidebarMenuButtonBase;
    if(size === 'sm') bsClasses += ' btn-sm';
    if(size === 'lg') bsClasses += ' btn-lg';
    if(isActive) bsClasses += ` ${sidebarMenuButtonActive}`;
    else bsClasses += ` ${sidebarMenuButtonHover} btn-light text-dark`;


   const triggerElement = (
      <Comp
         ref={combinedRef}
         data-sidebar="menu-button" 
         data-size={size}
         data-active={isActive}
         className={cn(bsClasses, className)}
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

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      // Bootstrap transition classes might need custom CSS for height animation
      className={cn(
        "overflow-hidden", // Basic Bootstrap class
        "data-[state=closed]:d-none data-[state=open]:d-block", // Simulate animation with display
        className
      )}
      {...props}
    >
      <ul className={cn("d-flex flex-column gap-1 py-1", "ps-4 pe-2")}>{children}</ul>
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
