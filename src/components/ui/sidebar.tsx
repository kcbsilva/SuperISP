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
        default: "bg-gray-200 text-card-foreground", // 👈 light grey background
        inset: "m-2 rounded-lg border bg-gray-200 text-card-foreground shadow-lg",
        floating: "m-2 rounded-lg border bg-gray-200 text-card-foreground shadow-lg",
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
  sidebarNodeRef: React.RefObject<HTMLElement | null>;
  // New properties for dropdown management
  openDropdownIds: string[]
  setOpenDropdownIds: React.Dispatch<React.SetStateAction<string[]>>
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
    const [openDropdownIds, setOpenDropdownIds] = React.useState<string[]>([]);
    const sidebarNodeRef = React.useRef<HTMLElement | null>(null);
    const pathname = usePathname();

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

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (sidebarNodeRef.current && !sidebarNodeRef.current.contains(event.target as Node)) {
          if (isMobile && isOpenMobile) {
            setIsOpenMobile(false);
          } else if (!isMobile && !isCollapsed) {
            setIsCollapsed(true);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isMobile, isOpenMobile, isCollapsed, setIsOpenMobile, setIsCollapsed, sidebarNodeRef]);

    React.useEffect(() => {
      if (!isMobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    }, [pathname, isMobile, setIsCollapsed]);

    // Close all dropdowns when sidebar collapses
    React.useEffect(() => {
      if (isCollapsed && !isMobile) {
        setOpenDropdownIds([]);
      }
    }, [isCollapsed, isMobile]);

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        variant,
        side,
        isMobile,
        isOpenMobile,
        setIsOpenMobile,
        isCollapsed,
        setIsCollapsed,
        sidebarNodeRef,
        openDropdownIds,
        setOpenDropdownIds,
      }),
      [variant, side, isMobile, isOpenMobile, setIsOpenMobile, isCollapsed, setIsCollapsed, sidebarNodeRef, openDropdownIds, setOpenDropdownIds]
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
  const { variant, side, isMobile, isOpenMobile, setIsOpenMobile, isCollapsed, sidebarNodeRef } = useSidebar()

  // Create a callback ref that updates both the internal ref and the forwarded ref
  const mergedRef = React.useCallback((node: HTMLElement | null) => {
    // Update the internal ref
    if (sidebarNodeRef) {
      sidebarNodeRef.current = node;
    }
    
    // Update the forwarded ref - handle both function refs and object refs
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && typeof ref === 'object' && 'current' in ref) {
      // Only assign if it's a mutable ref object
      try {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      } catch (error) {
        // Silently ignore if ref is read-only
        console.warn('Unable to assign to ref.current - ref may be read-only');
      }
    }
  }, [ref, sidebarNodeRef]);

  const commonProps = {
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
          ref={mergedRef}
          className={cn(
            sidebarVariants({ variant, side, collapsible: "full" }),
            "fixed inset-y-0 top-14 z-40 flex flex-col h-[calc(100vh-3.5rem)]",
            "border-r-2 border-primary", // ✅ You added this line
            (variant === "floating" || variant === "inset") && "p-2",
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
      ref={mergedRef}
      className={cn(
        sidebarVariants({ variant, side, collapsible: "full" }),
        "fixed inset-y-0 top-14 z-40 flex flex-col h-[calc(100vh-3.5rem)]",
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
      {(!isCollapsed || isMobile) && children}

      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "text-muted-foreground hover:text-foreground h-7 w-7",
            "mx-auto"
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
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isMobile, isCollapsed } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        isCollapsed && !isMobile ? "px-0 py-2" : "p-2",
        className
      )}
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
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </li>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "w-full justify-start text-left text-xs transition-all duration-150 ease-out flex items-center hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none rounded-md",
  {
    variants: {
      isActive: {
        true: "bg-muted text-primary font-semibold",
      },
      size: {
        default: "px-2.5 py-1.5",
        sm: "px-2 py-1 text-xs",
        lg: "px-3 py-2 text-sm",
      },
      isCollapsed: {
        true: "justify-center px-0",
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
          "gap-2.5",
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
  SidebarMenuSubTriggerProps & { "data-state"?: "open" | "closed" }
>(
  (
    { className, children, isActive, tooltip, size = "default", ...props },
    ref
  ) => {
    const { isMobile, isCollapsed, setIsCollapsed } = useSidebar();
    const originalOnClick = props.onClick;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isCollapsed && !isMobile) {
        setIsCollapsed(false);
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
          "gap-2.5",
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
        {(!isCollapsed || isMobile) && chevronElement && (
          <span className="transition-transform duration-150 ease-out"
            style={{ transform: props["data-state"] === "open" ? "rotate(180deg)" : "rotate(0deg)" }}>
            {chevronElement}
          </span>
        )}
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

  if (isCollapsed && !isMobile) {
    return null;
  }

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub-content"
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "overflow-hidden transition-all duration-200 ease-out",
        isOpen
          ? "max-h-96 opacity-100 transform translate-y-0"
          : "max-h-0 opacity-0 transform -translate-y-1",
        "pl-4",
        className
      )}
      style={{
        transitionProperty: 'max-height, opacity, transform',
      }}
      {...props}
    >
      <ul className={cn("flex flex-col gap-0.5 py-1")}>
        {children}
      </ul>
    </div>
  );
});
SidebarMenuSubContent.displayName = "SidebarMenuSubContent";

// FIXED: Helper function to extract only DIRECT child href values from SidebarMenuButton components
const extractDirectChildHrefs = (children: React.ReactNode): string[] => {
  const hrefs: string[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      // Check if this is a direct SidebarMenuButton with href prop
      if (child.props && typeof child.props.href === 'string') {
        hrefs.push(child.props.href);
      }
      // DO NOT recursively check children - this prevents nested dropdown hrefs from being included
    }
  });

  return hrefs;
};

// Helper function to check if current pathname matches any of the hrefs
const isPathActive = (pathname: string, hrefs: string[]): boolean => {
  return hrefs.some(href => {
    // Exact match
    if (pathname === href) return true;
    // Starts with href + / (for nested routes)
    if (href !== '/' && pathname.startsWith(href + '/')) return true;
    return false;
  });
};

const SidebarMenuSub = React.memo(React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean; id?: string }
>(({ className, children, defaultOpen = false, id, ...props }, ref) => {
  const { isMobile, isCollapsed, openDropdownIds, setOpenDropdownIds } = useSidebar();
  const pathname = usePathname();
  const justExpandedAndOpenedRef = React.useRef(false);

  // Generate a unique ID if not provided
  const dropdownId = React.useMemo(() => id || Math.random().toString(36).substr(2, 9), [id]);

  // Check if this dropdown is open
  const isOpen = openDropdownIds.includes(dropdownId);

  // FIXED: Extract only DIRECT child hrefs (not nested dropdown hrefs)
  const directChildHrefs = React.useMemo(() => {
    return extractDirectChildHrefs(children);
  }, [children]);

  // FIXED: Check if any DIRECT child is active (not nested dropdowns)
  const hasActiveDirectChild = React.useMemo(() => {
    return isPathActive(pathname, directChildHrefs);
  }, [pathname, directChildHrefs]);

  const toggleOpen = React.useCallback(() => {
    if (isCollapsed && !isMobile) {
      // If sidebar is collapsed, expand it and open this dropdown
      setOpenDropdownIds((prev: string[]) =>
        prev.includes(dropdownId) ? prev : [...prev, dropdownId]
      );
      justExpandedAndOpenedRef.current = true;
    } else {
      // If sidebar is expanded, toggle this dropdown only
      setOpenDropdownIds((prev: string[]) =>
        prev.includes(dropdownId)
          ? prev.filter(id => id !== dropdownId)
          : [...prev, dropdownId]
      );
    }
  }, [isCollapsed, isMobile, dropdownId, setOpenDropdownIds]);


  // Effect to manage dropdown state based on active children
  React.useEffect(() => {
    if (!isMobile && !isCollapsed) { // Only on desktop and when sidebar is expanded
      if (justExpandedAndOpenedRef.current) {
        // It was just opened by a click that expanded the sidebar.
        // Keep it open (already set by toggleOpen) and consume the flag.
        justExpandedAndOpenedRef.current = false;
      } else if (hasActiveDirectChild) {
        // FIXED: Only open if a DIRECT child is active (not nested dropdown children)
        setOpenDropdownIds((prev: string[]) => prev.includes(dropdownId) ? prev : [...prev, dropdownId]);
      } else if (defaultOpen && openDropdownIds.length === 0) {
        // Not just expanded by a click, no active children, and no dropdown is currently open
        // Set this as the open dropdown if it should be open by default
        setOpenDropdownIds((prev: string[]) => prev.includes(dropdownId) ? prev : [...prev, dropdownId]);
      }
    }
  }, [pathname, isMobile, isCollapsed, hasActiveDirectChild, defaultOpen, dropdownId, openDropdownIds, setOpenDropdownIds]);

  let trigger: React.ReactNode = null;
  let content: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ((child.type as any).displayName === "SidebarMenuSubTrigger") {
        trigger = React.cloneElement(child as React.ReactElement<any>, {
          onClick: toggleOpen,
          "data-state": isOpen && (!isCollapsed || isMobile) ? "open" : "closed",
          isActive: hasActiveDirectChild, // FIXED: Mark trigger as active only if DIRECT child is active
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