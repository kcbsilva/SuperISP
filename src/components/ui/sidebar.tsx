
// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";

const sidebarVariants = cva(
  "group/sidebar peer relative flex flex-col text-card-foreground transition-[width] duration-300 ease-in-out",
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
        full: "w-[var(--sidebar-width)] data-[collapsed=true]:w-[var(--sidebar-width-icon)]",
        icon: "w-[var(--sidebar-width-icon)] data-[collapsed=false]:w-[var(--sidebar-width)]",
      },
    },
    defaultVariants: {
      variant: "default",
      side: "left",
      collapsible: "full",
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
  isMobile: boolean
  isOpenMobile: boolean
  setIsOpenMobile: (open: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
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
    Pick<SidebarProps, "variant" | "side"> & {
      defaultOpenMobile?: boolean
      defaultCollapsedDesktop?: boolean
    }
>(
  (
    {
      className,
      children,
      variant = "default",
      side = "left",
      defaultOpenMobile,
      defaultCollapsedDesktop = false,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [isOpenMobile, setIsOpenMobile] = React.useState(defaultOpenMobile ?? false)
    const [isCollapsed, setIsCollapsedState] = React.useState(defaultCollapsedDesktop);

    React.useEffect(() => {
      if (typeof window !== 'undefined' && !isMobile) {
        const stored = localStorage.getItem("sidebarCollapsed");
        if (stored !== null) {
          setIsCollapsedState(JSON.parse(stored));
        }
      }
    }, [isMobile]);

    const setIsCollapsed = React.useCallback((collapsed: boolean) => {
      if (!isMobile) {
        setIsCollapsedState(collapsed);
        if (typeof window !== 'undefined') {
          localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
        }
      }
    }, [isMobile]);

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        variant,
        side,
        isMobile,
        isOpenMobile,
        setIsOpenMobile,
        isCollapsed,
        setIsCollapsed,
      }),
      [variant, side, isMobile, isOpenMobile, setIsOpenMobile, isCollapsed, setIsCollapsed]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div ref={ref} className={cn("flex h-full w-full", className)} {...props}>
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
  const { variant, side, isMobile, isOpenMobile, setIsOpenMobile, isCollapsed } = useSidebar()

  const commonProps = {
    ref,
    "data-sidebar": "sidebar",
    "data-variant": variant,
    "data-side": side,
    "data-collapsible": "full",
    "data-collapsed": isMobile ? "false" : isCollapsed.toString(),
    ...props,
  }

  if (isMobile) {
    return (
      <>
        {isOpenMobile && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpenMobile(false)} />}
        <nav
          className={cn(
            sidebarMobileVariants({ side }),
            "w-[var(--sidebar-width)]", // Mobile always uses full width when open
            variant === "inset" && "m-0 rounded-none border-none shadow-none",
            variant === "floating" && "m-0 rounded-none border-none shadow-none",
            className
          )}
          data-state={isOpenMobile ? "open" : "closed"}
          {...commonProps}
          data-collapsed="false" // Ensure mobile is never considered "collapsed" for styling
        >
          {children}
        </nav>
      </>
    )
  }

  // Desktop sidebar - now fixed position for overlay effect
  return (
    <nav
      className={cn(
        sidebarVariants({ variant, side, collapsible: "full" }),
        "fixed inset-y-0 top-14 z-40 flex flex-col h-[calc(100vh-3.5rem)]", // Added fixed, inset-y-0, z-40 and top-14, adjusted height
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
  const { isMobile, isCollapsed, setIsCollapsed, side } = useSidebar();

  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex items-center shrink-0 h-14",
        isCollapsed && !isMobile ? "justify-center" : "justify-between",
        "px-3",
        className
      )}
      {...props}
    >
      {!isMobile && !isCollapsed && children}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "text-muted-foreground hover:text-foreground h-7 w-7",
            isCollapsed ? "mx-auto" : (side === "left" ? "ml-auto" : "mr-auto")
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {side === "left" ? (
            isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          ) : (
            isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      )}
      {isMobile && children}
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
      className={cn("mt-auto p-2 shrink-0 h-14 flex items-center justify-between",
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
      className={cn("flex flex-col gap-0.5", className)}
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
        default: "px-2.5 py-1.5", // Original padding for expanded
        sm: "px-2 py-1 text-xs", // Original padding for sub-menu items
        lg: "px-3 py-2 text-sm",
      },
      isCollapsed: {
        true: "justify-center px-0 w-[var(--sidebar-width-icon)] data-[collapsed=true]:w-[var(--sidebar-width-icon)]", // Centered icon for collapsed state
        false: ""
      }
    },
    defaultVariants: {
      isActive: false,
      size: "default",
      isCollapsed: false,
    },
  }
);

interface SidebarMenuButtonProps extends Omit<NextLinkProps, 'asChild' | 'legacyBehavior'> {
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
    const { isMobile, setIsOpenMobile, isCollapsed } = useSidebar();
    const Comp = asChild ? Slot : NextLink;

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isMobile) {
        setIsOpenMobile(false);
      }
      // No auto-expansion for direct links when collapsed
      if (props.onClick) {
        props.onClick(event);
      }
    };

    const actualChildrenArray = React.Children.toArray(children);
    const iconElement = actualChildrenArray[0];
    const textElement = actualChildrenArray.length > 1 ? actualChildrenArray[1] : null;

    const buttonContent = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: isCollapsed && !isMobile }),
          className
        )}
        href={href}
        onClick={handleClick}
        {...props}
      >
        {iconElement}
        {textElement && (!isCollapsed || isMobile) && (
            React.isValidElement(textElement) ?
            React.cloneElement(textElement as React.ReactElement, {
              className: cn((textElement.props as any).className, "truncate")
            })
            : <span className="truncate">{textElement}</span>
        )}
      </Comp>
    );

    if (tooltip && (isCollapsed && !isMobile)) {
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

const SidebarMenuSubTrigger = React.memo(React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubTriggerProps & { onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; "data-state": "open" | "closed" }
>(
  (
    { className, children, isActive, tooltip, size = "default", ...props },
    ref
  ) => {
    const { isMobile, isCollapsed, setIsCollapsed } = useSidebar();
    const originalOnClick = props.onClick;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isCollapsed && !isMobile) {
        setIsCollapsed(false); // Expand the main sidebar first
      }
      if (originalOnClick) {
        originalOnClick(event);
      }
    };

    const actualChildrenArray = React.Children.toArray(children);
    const iconElement = actualChildrenArray[0];
    const textElement = actualChildrenArray.length > 1 ? actualChildrenArray[1] : null;
    const chevronElement = actualChildrenArray.length > 2 ? actualChildrenArray[2] : null;

    const buttonContent = (
      <button
        type="button"
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: isCollapsed && !isMobile }),
          "group/sub-trigger",
          className
        )}
        {...props}
        onClick={handleClick}
      >
        {iconElement}
        {textElement && (!isCollapsed || isMobile) && (
            React.isValidElement(textElement) ?
            React.cloneElement(textElement as React.ReactElement, {
              className: cn((textElement.props as any).className, "truncate")
            })
            : <span className="truncate">{textElement}</span>
        )}
        {(!isCollapsed || isMobile) && chevronElement}
      </button>
    );

    if (tooltip && (isCollapsed && !isMobile)) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
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
  React.HTMLAttributes<HTMLDivElement> & { isOpen: boolean }
>(({ className, children, isOpen, ...props }, ref) => {
  const { isMobile, isCollapsed } = useSidebar();

  if (!isOpen || (isCollapsed && !isMobile)) {
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

const SidebarMenuSub = React.memo(React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }
>(({ className, children, defaultOpen = false, ...props }, ref) => {
  const { isMobile, isCollapsed } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const pathname = usePathname();

  React.useEffect(() => {
    if (isCollapsed && !isMobile) {
      setIsOpen(false);
    } else if (!isMobile) { 
        let isActiveChild = false;
        React.Children.forEach(children, child => {
            if (React.isValidElement(child) && (child.type as any).displayName === "SidebarMenuSubContent") {
                React.Children.forEach(child.props.children, subChild => { 
                    if (React.isValidElement(subChild) && subChild.props.children) {
                        React.Children.forEach(subChild.props.children, (buttonChild: any) => {
                           if (React.isValidElement(buttonChild) && buttonChild.props.href && pathname.startsWith(buttonChild.props.href)) {
                               isActiveChild = true;
                           }
                        });
                    }
                });
            }
        });
        if (isActiveChild && !isCollapsed) {
            setIsOpen(true);
        } else if (!isCollapsed) { 
            setIsOpen(defaultOpen);
        }
    }
  }, [defaultOpen, pathname, isCollapsed, isMobile, children]);


  const toggleOpen = React.useCallback(() => {
    if (isCollapsed && !isMobile) {
      setIsOpen(true);
    } else {
      setIsOpen(prev => !prev);
    }
  }, [isCollapsed, isMobile]);

  let trigger: React.ReactNode = null;
  let content: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ((child.type as any).displayName === "SidebarMenuSubTrigger") {
        trigger = React.cloneElement(child as React.ReactElement<any>, {
          onClick: toggleOpen,
          "data-state": isOpen && (!isCollapsed || isMobile) ? "open" : "closed",
        });
      } else if ((child.type as any).displayName === "SidebarMenuSubContent") {
        content = React.cloneElement(child as React.ReactElement<any>, { isOpen });
      }
    }
  });

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub"
      data-state={isOpen && (!isCollapsed || isMobile) ? "open" : "closed"}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {trigger}
      {content}
    </div>
  );
}));
SidebarMenuSub.displayName = "SidebarMenuSub";

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
  HTMLDivElement,
  React.ComponentProps<"div"> & { noMargin?: boolean }
>(({ className, noMargin, children, ...props }, ref) => {
  const { side, isMobile } = useSidebar();

  let marginClass = "";
  // Only apply the static margin for the icon-only sidebar width on desktop
  if (!noMargin && !isMobile) {
    marginClass = side === 'left' ? 'ml-[var(--sidebar-width-icon)]' : 'mr-[var(--sidebar-width-icon)]';
  }

  return (
    <main
      ref={ref}
      className={cn(
        "relative flex-1 overflow-auto",
        marginClass,
        className
      )}
      {...props}
    >
      {children}
    </main>
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
