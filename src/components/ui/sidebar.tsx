// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import Link, { type LinkProps } from "next/link";
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react" // ChevronLeft and ChevronRight removed as sidebar is not collapsible
import { useIsMobile } from "@/hooks/use-mobile" // Corrected import path
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'; // Keep Button import

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
      // Collapsible variants are kept for structure but effectively not used if collapsible="none"
      collapsible: {
        none: "w-[var(--sidebar-width)]", // Always use standard width if not collapsible
        icon: "w-[var(--sidebar-width-icon)] data-[collapsed=false]:w-[var(--sidebar-width)]",
        full: "w-[var(--sidebar-width)] data-[collapsed=true]:w-[var(--sidebar-width-icon)]"
      },
    },
    defaultVariants: {
      variant: "default",
      side: "left",
      collapsible: "none", // Default to non-collapsible
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
      collapsible = "none", // Set to none, making it non-collapsible
      defaultCollapsed, // This will be ignored if collapsible is 'none'
      defaultOpenMobile,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    // collapsed state is managed but effectively ignored if collapsible is 'none'
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed ?? false)
    const [isOpenMobile, setIsOpenMobile] = React.useState(defaultOpenMobile ?? false)

    React.useEffect(() => {
      if (isMobile) {
        setCollapsed(false) // Always expand on mobile
      }
    }, [isMobile])


    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        variant,
        side,
        collapsed: collapsible === 'none' ? false : collapsed, // Ensure collapsed is false if not collapsible
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
    "data-collapsed": collapsed, // Reflects current collapsed state
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
  
  // Non-collapsible: always use --sidebar-width
  const widthClass = "w-[var(--sidebar-width)]";

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
  const { collapsed } = useSidebar(); // Get collapsed state
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex items-center border-b p-2 shrink-0 h-12",
        collapsed ? "justify-center" : "justify-between", // Center logo when collapsed
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
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("mt-auto border-t p-2 shrink-0 h-12 flex items-center", className)}
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
      className={cn(className)}
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
        sm: "px-2 py-1 text-xs", // Adjusted sizes
        lg: "px-3 py-2 text-sm",
      },
      isCollapsed: { // Kept for structure, but not used if collapsible='none'
        true: "justify-center [&>span:not(.sr-only)]:hidden [&>svg~svg]:hidden", // Hide text and extra chevrons when collapsed
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


// Interface for SidebarMenuButton props
interface SidebarMenuButtonProps extends Omit<LinkProps, 'asChild' | 'legacyBehavior'> {
  isActive?: boolean;
  tooltip?: React.ReactNode;
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  children: React.ReactNode;
  href: string; // href is now required
}


const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement, // Changed to HTMLAnchorElement as we always render Link
  SidebarMenuButtonProps
>(
  (
    { className, isActive, children, tooltip, size = "default", asChild, href, ...props },
    ref
  ) => {
    const { collapsed, collapsible, isMobile } = useSidebar();
    const hideText = collapsible !== 'none' && collapsed && !isMobile;

    const Comp = asChild ? Slot : Link;

    const buttonChildren = (
      <>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === ChevronDown) {
            // Don't render ChevronDown if text is hidden (collapsed)
            return hideText ? null : React.cloneElement(child as React.ReactElement<any>);
          }
          // For icons and text (span), render them but text might be hidden by CSS
          if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type.displayName?.includes('LucideIcon') || child.type.name?.includes('LucideIcon'))) {
            return React.cloneElement(child as React.ReactElement<any>); // Render icon
          }
          if (React.isValidElement(child) && child.type === 'span' && (child.props as any).className?.includes('truncate')) {
            return React.cloneElement(child as React.ReactElement<any>, { className: cn(child.props.className, hideText && 'sr-only') });
          }
          return child;
        })}
      </>
    );

    const buttonElement = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText }),
          className
        )}
        href={href} // href is always present
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
          <TooltipContent side="right" align="center">
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
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="menu-sub"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"


const SidebarMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { // Changed to ButtonHTMLAttributes
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
        type="button" // Explicitly set type for button
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText }),
          "justify-between", // Default for trigger
          className
        )}
        {...props}
      >
        {/* Render children, applying sr-only to text if collapsed */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type === 'string' && child.type === 'span') {
            return React.cloneElement(child as React.ReactElement<any>, {className: cn(hideText && "sr-only", (child.props as any).className) });
          }
          // Render icons (like ChevronDown) normally
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
          <TooltipContent side="right" align="center">
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
>(({ className, children, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar()
  const hideText = collapsible !== 'none' && collapsed;

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub-content"
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        hideText ? "max-h-0" : "max-h-[--radix-accordion-content-height] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
        !hideText && "pl-4", // Apply padding only when not collapsed
        className
      )}
      {...props}
    >
      <ul className={cn("flex flex-col gap-0.5 py-1", hideText && "hidden")}>{children}</ul>
    </div>
  )
})
SidebarMenuSubContent.displayName = "SidebarMenuSubContent"


const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar()
  const hideText = collapsible !== 'none' && collapsed;

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

  const marginClass = React.useMemo(() => {
    if (noMargin || isMobile) return 'md:ml-0 md:mr-0'; // No margin on mobile or if noMargin is true
    
    let marginLeft = '0px';
    let marginRight = '0px';

    const baseWidthVar = (collapsible !== 'none' && collapsed) ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)';
    const gap = (variant === 'floating' || variant === 'inset') ? '1rem' : '0px'; // Corresponds to p-2 (0.5rem) on each side for floating/inset

    if (side === 'left') {
      marginLeft = `calc(${baseWidthVar} + ${gap})`;
    } else { // side === 'right'
      marginRight = `calc(${baseWidthVar} + ${gap})`;
    }
    
    // Add a fixed 20px gap as requested
    if (side === 'left') {
        marginLeft = `calc(${marginLeft} + 20px)`;
    } else {
        marginRight = `calc(${marginRight} + 20px)`;
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
      style={{ marginLeft: marginClass.marginLeft, marginRight: marginClass.marginRight }}
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
