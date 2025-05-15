// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import Link, { type LinkProps } from "next/link"; // Added Link import
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react" // Renamed to avoid conflict
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip" // TooltipProvider is used in layout.tsx

const sidebarVariants = cva(
  "group/sidebar peer relative hidden md:block text-sidebar-foreground transition-[width] duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-background",
        inset: "m-2 rounded-lg border bg-background shadow-lg",
        floating: "m-2 rounded-lg border bg-background shadow-lg",
      },
      side: {
        left: "inset-y-0 left-0 border-r",
        right: "inset-y-0 right-0 border-l",
      },
      collapsible: {
        none: "w-[var(--sidebar-width)]",
        icon: "w-[var(--sidebar-width-icon)] data-[collapsed=false]:w-[var(--sidebar-width)]",
        full: "w-[var(--sidebar-width)] data-[collapsed=true]:w-[var(--sidebar-width-icon)]"
      },
    },
    defaultVariants: {
      variant: "default",
      side: "left",
      collapsible: "full", // Default to full, allowing collapse
    },
  }
)

const sidebarMobileVariants = cva(
  "fixed inset-y-0 z-50 h-full text-sidebar-foreground bg-background border-border shadow-xl transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
  {
    variants: {
      side: {
        left: "left-0 border-r",
        right: "right-0 border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
      },
    },
    defaultVariants: {
      side: "left",
    },
  }
)


interface SidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sidebarVariants> {
  asChild?: boolean
}


type SidebarContextValue = {
  variant: VariantProps<typeof sidebarVariants>["variant"]
  side: VariantProps<typeof sidebarVariants>["side"]
  collapsed: boolean
  collapsible: VariantProps<typeof sidebarVariants>["collapsible"]
  setCollapsed: (collapsed: boolean) => void
  isMobile: boolean
  isOpenMobile: boolean
  setIsOpenMobile: (open: boolean) => void
}


const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    Pick<SidebarProps, "variant" | "side" | "collapsible"> & {
      defaultCollapsed?: boolean
      defaultOpenMobile?: boolean
    }
>(
  (
    {
      className,
      children,
      variant = "default",
      side = "left",
      collapsible = "full", // Allow collapsible by default
      defaultCollapsed,
      defaultOpenMobile,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed ?? false)
    const [isOpenMobile, setIsOpenMobile] = React.useState(defaultOpenMobile ?? false)

    React.useEffect(() => {
      if (isMobile) {
        // On mobile, the main sidebar might be "collapsed" to save space,
        // but the mobile overlay menu takes over.
        // Or, if it's not meant to be collapsible on desktop,
        // this might need adjustment based on exact mobile behavior desired.
        // For now, let's assume desktop settings influence mobile default.
      }
    }, [isMobile])


    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        variant,
        side,
        collapsed, // Use the actual collapsed state
        collapsible,
        setCollapsed,
        isMobile,
        isOpenMobile,
        setIsOpenMobile,
      }),
      [variant, side, collapsed, collapsible, isMobile, isOpenMobile, setCollapsed, setIsOpenMobile]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div ref={ref} className={cn("flex h-full", className)} {...props}>
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"


const Sidebar = React.forwardRef<
  HTMLElement,
  SidebarProps
>(({ className, children, ...props }, ref) => {
  const { variant, side, collapsible, collapsed, isMobile, isOpenMobile, setIsOpenMobile } = useSidebar()
  
  const commonProps = {
    ref,
    "data-sidebar": "sidebar",
    "data-variant": variant,
    "data-side": side,
    "data-collapsed": collapsed,
    "data-collapsible": collapsible,
    ...props,
  }

  if (isMobile) {
    return (
      <>
        {isOpenMobile && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpenMobile(false)} />}
        <nav
          className={cn(
            sidebarMobileVariants({ side }),
            "w-[var(--sidebar-width)]", // Use standard width for mobile
            variant === "inset" && "m-0 rounded-none border-none shadow-none",
            variant === "floating" && "m-0 rounded-none border-none shadow-none",
            className
          )}
          data-state={isOpenMobile ? "open" : "closed"}
          {...commonProps}
        >
          {children}
        </nav>
      </>
    )
  }
  
  const widthClass = collapsible === "none" 
    ? "w-[var(--sidebar-width)]" 
    : collapsed 
      ? "w-[var(--sidebar-width-icon)]" 
      : "w-[var(--sidebar-width)]";

  return (
    <nav
      className={cn(
        sidebarVariants({ variant, side, collapsible }),
        "flex flex-col",
        widthClass,
        (variant === "floating" || variant === "inset") && "p-2",
        className
      )}
      {...commonProps}
    >
      {children}
    </nav>
  )
})
Sidebar.displayName = "Sidebar"


const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { collapsed } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex items-center border-b p-2 shrink-0 h-12", // Ensure consistent height
        collapsed ? "justify-center px-1" : "justify-between px-3", // Adjust padding when collapsed
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"


const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"


const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { collapsed } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("mt-auto border-t p-2 shrink-0 h-12 flex items-center", 
        collapsed ? "justify-center" : "justify-between",
      className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"


const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, children, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex flex-col gap-0.5 p-2", className)}
      {...props}
    >
      {children}
    </ul>
  )
})
SidebarMenu.displayName = "SidebarMenu"


const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn(className)} // Removed "group/menu-item" as it's not used
      {...props}
    >
      {children}
    </li>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "w-full justify-start rounded-md px-2.5 py-1.5 text-left text-xs transition-colors flex items-center gap-2 hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
  {
    variants: {
      isActive: {
        true: "bg-muted text-primary font-semibold",
      },
      size: {
        default: "",
        sm: "px-2 py-1 text-xs",
        lg: "px-3 py-2 text-sm",
      },
      isCollapsed: {
        true: "justify-center [&>span:not(.sr-only)]:sr-only [&svg~svg:not(.lucide-chevron-down,.lucide-chevron-right)]:hidden", // Hide text and subsequent svgs (except chevrons)
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
      size: "default",
      isCollapsed: false,
    },
  }
);

interface SidebarMenuButtonProps extends Omit<LinkProps, 'asChild' | 'legacyBehavior'> {
  isActive?: boolean;
  tooltip?: React.ReactNode;
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  children: React.ReactNode;
  href: string;
}


const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  SidebarMenuButtonProps
>(
  (
    { className, isActive, children, tooltip, size = "default", asChild, href, ...props },
    ref
  ) => {
    const { collapsed, collapsible, isMobile } = useSidebar();
    const hideText = collapsible !== 'none' && collapsed && !isMobile;

    const Comp = asChild ? Slot : Link;

    const buttonChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === 'span' && (child.props as any).className?.includes('truncate')) {
          return React.cloneElement(child as React.ReactElement<any>, {
            className: cn((child.props as any).className, hideText && 'sr-only'),
          });
        }
      }
      return child;
    });
    
    const buttonElement = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText }),
          className
        )}
        href={href}
        {...props}
      >
        {buttonChildren}
      </Comp>
    );
    
    if (hideText && tooltip && !isMobile) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {buttonElement}
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }
    return buttonElement;
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { "data-state"?: "open" | "closed" }
>(({ className, "data-state": dataState, children, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar();
  const isEffectivelyCollapsed = collapsible !== "none" && collapsed;

  // If the parent SidebarMenuSub is collapsed, its content should also be considered closed
  // to ensure correct animation and visibility.
  const derivedDataState = isEffectivelyCollapsed ? "closed" : dataState;

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub"
      data-state={derivedDataState} // Reflect actual open/closed state
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";


const SidebarMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean
    tooltip?: React.ReactNode
    size?: "default" | "sm" | "lg"
  }
>(
  (
    { className, children, isActive, tooltip, size = "default", ...props },
    ref
  ) => {
    const { collapsed, collapsible, isMobile } = useSidebar();
    const hideText = collapsible !== 'none' && collapsed && !isMobile;

    const buttonContent = (
      <button
        type="button"
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText }),
          "group/sub-trigger", // Add group for chevron
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
           if (React.isValidElement(child)) {
            if (child.type === 'span' && (child.props as any).className?.includes('truncate')) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    className: cn((child.props as any).className, hideText && 'sr-only'),
                });
            }
            // Ensure ChevronDown or ChevronRight is always visible if present
            if (child.type === ChevronDown || child.type === ChevronRightIcon) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    className: cn((child.props as any).className, "transition-transform group-data-[state=open]/sub-trigger:rotate-90")
                });
            }
          }
          return child;
        })}
      </button>
    )
    
    if (hideText && tooltip && !isMobile) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      )
    }
    return buttonContent
  }
)
SidebarMenuSubTrigger.displayName = "SidebarMenuSubTrigger"


const SidebarMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { "data-state"?: "open" | "closed" }
>(({ className, children, "data-state": dataStateProp, ...props }, ref) => {
  const { collapsed, collapsible, isMobile } = useSidebar();
  const isParentEffectivelyCollapsed = collapsible !== "none" && collapsed && !isMobile;

  // Determine the effective data-state for animations/visibility
  // If the parent is collapsed (icon-only mode), the submenu content should always be "closed" visually.
  const effectiveDataState = isParentEffectivelyCollapsed ? "closed" : dataStateProp;

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub-content"
      data-state={effectiveDataState}
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        // When not collapsed (parent is expanded), use accordion animations
        !isParentEffectivelyCollapsed && "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
        // When parent is collapsed (icon-only), ensure it's hidden and doesn't take space
        isParentEffectivelyCollapsed && "max-h-0",
        // Apply padding for indentation only when the parent is expanded
        !isParentEffectivelyCollapsed && "pl-4", 
        className
      )}
      {...props}
    >
      {/* The content (ul) should only be visible if the parent is not collapsed */}
      <ul className={cn("flex flex-col gap-0.5 py-1", isParentEffectivelyCollapsed && "hidden")}>
        {children}
      </ul>
    </div>
  );
});
SidebarMenuSubContent.displayName = "SidebarMenuSubContent"


const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
  const { collapsed, collapsible, isMobile } = useSidebar();
  const hideText = collapsible !== 'none' && collapsed && !isMobile;

  return (
    <hr
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "my-1 border-border",
        hideText && "mx-auto w-3/4",
        className
      )}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main"> & { noMargin?: boolean }
>(({ className, noMargin, ...props }, ref) => {
  const { side, variant, collapsed, collapsible, isMobile } = useSidebar();

  const marginStyle = React.useMemo(() => {
    if (noMargin || isMobile) return { marginLeft: '0px', marginRight: '0px' };
    
    let baseWidthVar = 'var(--sidebar-width)';
    if (collapsible !== 'none' && collapsed) {
      baseWidthVar = 'var(--sidebar-width-icon)';
    }
    
    const gap = (variant === 'floating' || variant === 'inset') ? '0.5rem' : '0px'; // Tailwind p-2 is 0.5rem

    let marginLeft = '0px';
    let marginRight = '0px';

    if (side === 'left') {
      marginLeft = `calc(${baseWidthVar} + ${gap} + 20px)`; // Add 20px gap
    } else { // side === 'right'
      marginRight = `calc(${baseWidthVar} + ${gap} + 20px)`; // Add 20px gap
    }

    return { marginLeft, marginRight };

  }, [side, variant, collapsed, collapsible, noMargin, isMobile]);


  return (
    <main
      ref={ref}
      className={cn(
        "relative flex-1 overflow-auto transition-[margin] duration-300 ease-in-out",
        className
      )}
      style={marginStyle}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"


export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarSeparator,
  SidebarInset,
  useSidebar,
};
