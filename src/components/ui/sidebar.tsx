
// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import Link, { type LinkProps } from "next/link";
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, type LucideIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';

const sidebarVariants = cva(
  "group/sidebar peer relative hidden md:block text-card-foreground transition-[width] duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        inset: "m-2 rounded-lg border bg-card text-card-foreground shadow-lg",
        floating: "m-2 rounded-lg border bg-card text-card-foreground shadow-lg",
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
      collapsible: "none",
    },
  }
)

const sidebarMobileVariants = cva(
  "fixed inset-y-0 z-50 h-full text-card-foreground bg-card border-border shadow-xl transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
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
      collapsible = "none",
      defaultCollapsed,
      defaultOpenMobile,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [collapsed, setCollapsedInternal] = React.useState(collapsible === 'none' ? false : defaultCollapsed ?? false);
    const [isOpenMobile, setIsOpenMobile] = React.useState(defaultOpenMobile ?? false)

    const setCollapsed = React.useCallback((value: boolean) => {
      if (collapsible !== 'none') {
        setCollapsedInternal(value);
      } else {
        setCollapsedInternal(false);
      }
    }, [collapsible]);

    React.useEffect(() => {
      if (collapsible === 'none') {
        setCollapsedInternal(false);
      }
    }, [collapsible]);


    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        variant,
        side,
        collapsed: collapsible === 'none' ? false : collapsed,
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
        <div ref={ref} className={cn("flex h-full", className)} {...props}> {/* Ensure this div has h-full */}
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
  const currentCollapsibleMode = collapsible === 'none' ? 'none' : (collapsed ? 'icon' : 'full');

  const commonProps = {
    ref,
    "data-sidebar": "sidebar",
    "data-variant": variant,
    "data-side": side,
    "data-collapsed": collapsed.toString(),
    "data-collapsible": currentCollapsibleMode, // Use the derived mode
    ...props,
  }

  if (isMobile) {
    return (
      <>
        {isOpenMobile && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpenMobile(false)} />}
        <nav
          className={cn(
            sidebarMobileVariants({ side }),
            "w-[var(--sidebar-width)]", // Mobile sidebar width
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

  return (
    <nav
      className={cn(
        sidebarVariants({ variant, side, collapsible: currentCollapsibleMode }),
        "flex flex-col h-full",
        (variant === "floating" || variant === "inset") && "p-2",
        className
      )}
      style={{ width: 'var(--sidebar-width)' }} // Ensure fixed width when not collapsible
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
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex items-center p-2 shrink-0 h-14 justify-center px-3",
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
      className={cn("flex-1 overflow-y-auto overflow-x-hidden p-2", className)}
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
      className={cn("mt-auto p-2 shrink-0 h-14 flex items-center justify-between", // Removed border-t
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
      isCollapsed: {
        true: "[&>span:not(.sr-only)]:sr-only justify-center px-0",
      },
      size: {
        default: "",
        sm: "px-2 py-1 text-xs",
        lg: "px-3 py-2 text-sm",
      },
    },
    defaultVariants: {
      isActive: false,
      isCollapsed: false,
      size: "default",
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
  className?: string;
}

const SidebarMenuButton = React.memo(React.forwardRef<
  HTMLAnchorElement,
  SidebarMenuButtonProps
>(
  (
    { className, isActive, children, tooltip, size = "default", asChild, href, ...props },
    ref
  ) => {
    const { collapsed, collapsible, isMobile } = useSidebar();
    const hideText = collapsible !== 'none' && collapsed;
    const Comp = asChild ? Slot : Link;

    const buttonChildren = React.Children.toArray(children).map((child, index) => {
      if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).displayName?.includes('Icon')) {
         return React.cloneElement(child as React.ReactElement<any>, { className: cn("h-3 w-3", (child.props as any).className) });
      }
      if (typeof child === 'string' || (React.isValidElement(child) && child.type === 'span')) {
        if (hideText && !isMobile) {
          return <span key={index} className="sr-only">{child}</span>;
        }
        return child;
      }
      return child;
    });


    const buttonContent = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText && !isMobile }),
          className
        )}
        href={href}
        {...props}
      >
        {buttonChildren}
      </Comp>
    );

    if (tooltip && hideText && !isMobile) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }
    return buttonContent;
  }
));
SidebarMenuButton.displayName = "SidebarMenuButton";


interface SidebarMenuSubTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: React.ReactNode;
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  className?: string;
}

// Context for submenu state
interface SidebarMenuSubContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarMenuSubContext = React.createContext<SidebarMenuSubContextValue | null>(null);

function useSidebarMenuSub() {
  const context = React.useContext(SidebarMenuSubContext);
  if (!context) {
    throw new Error("useSidebarMenuSub must be used within a SidebarMenuSub component");
  }
  return context;
}

const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }
>(({ className, children, defaultOpen = false, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const { collapsed, collapsible } = useSidebar();
  const pathname = usePathname();

  // Effect to close submenu if sidebar is collapsed (unless non-collapsible)
  React.useEffect(() => {
    if (collapsible !== 'none' && collapsed) {
      setIsOpen(false);
    }
  }, [collapsed, collapsible]);

  // Effect to update isOpen based on defaultOpen if it changes (e.g., due to navigation)
  React.useEffect(() => {
    // Only set to defaultOpen if the sidebar is not collapsed (or is non-collapsible)
    // This prevents submenus from auto-opening when the sidebar is programmatically collapsed
    // while a child route is active.
    if (!(collapsible !== 'none' && collapsed)) {
      setIsOpen(defaultOpen);
    }
  }, [defaultOpen, collapsed, collapsible, pathname]); // pathname dependency re-evaluates on route change

  const contextValue = React.useMemo(() => ({
    isOpen,
    setIsOpen,
  }), [isOpen]);

  return (
    <SidebarMenuSubContext.Provider value={contextValue}>
      <div
        ref={ref}
        data-sidebar="menu-sub"
        data-state={isOpen ? "open" : "closed"}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarMenuSubContext.Provider>
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";


const SidebarMenuSubTrigger = React.memo(React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubTriggerProps
>(
  (
    { className, children, isActive, tooltip, size = "default", ...props },
    ref
  ) => {
    const subContext = useSidebarMenuSub();
    const { collapsed, collapsible, isMobile } = useSidebar();
    const hideText = collapsible !== 'none' && collapsed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // Prevent any default button behavior
      subContext.setIsOpen(!subContext.isOpen);
    };

    const triggerChildren = React.Children.toArray(children).map((child, index) => {
       if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).displayName?.includes('Icon')) {
         return React.cloneElement(child as React.ReactElement<any>, { className: cn("h-3 w-3", (child.props as any).className) });
       }
      if (typeof child === 'string' || (React.isValidElement(child) && child.type === 'span')) {
        if (hideText && !isMobile) {
          return <span key={index} className="sr-only">{child}</span>;
        }
        return child;
      }
      return child;
    });

    const buttonContent = (
      <button
        type="button"
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-state={subContext.isOpen ? "open" : "closed"}
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText && !isMobile }),
          "group/sub-trigger",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {triggerChildren}
      </button>
    );

    if (tooltip && hideText && !isMobile) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }
    return buttonContent;
  }
));
SidebarMenuSubTrigger.displayName = "SidebarMenuSubTrigger";


const SidebarMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebarMenuSub();
  const { collapsed, collapsible } = useSidebar();

  if ((collapsible !== 'none' && collapsed) || !isOpen) {
    return null;
  }

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub-content"
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
        "pl-4",
        className
      )}
      {...props}
    >
      <ul className={cn("flex flex-col gap-0.5 py-1")}>
        {children}
      </ul>
    </div>
  );
});
SidebarMenuSubContent.displayName = "SidebarMenuSubContent";


const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      data-sidebar="separator"
      className={cn(
        "my-1 border-border",
        className
      )}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";


const SidebarInset = React.forwardRef<
  HTMLDivElement, // Changed from main to div
  React.ComponentProps<"div"> & { noMargin?: boolean } // Changed from main to div
>(({ className, noMargin, children, ...props }, ref) => { // Added children prop
   const { side, variant } = useSidebar();

   const marginClass = React.useMemo(() => {
     if (noMargin) return '';
     return 'md:ml-5'; // set margin to 5, for a gap of 20px
   }, [noMargin]);

  return (
    <div // Changed from main to div
      ref={ref}
      className={cn(
        "relative flex-1 overflow-auto",
        marginClass,
        className
      )}
      {...props}
    >
      {children} {/* Render children */}
    </div>
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

