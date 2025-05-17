
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
        default: "bg-card text-card-foreground", // Sidebar is white in light theme
        inset: "m-2 rounded-lg border bg-card text-card-foreground shadow-lg",
        floating: "m-2 rounded-lg border bg-card text-card-foreground shadow-lg",
      },
      side: {
        left: "inset-y-0 left-0 border-r",
        right: "inset-y-0 right-0 border-l",
      },
      collapsible: { // This variant is less relevant now as we are not using collapsed state
        none: "w-[var(--sidebar-width)]",
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
  // collapsed: boolean // No longer needed as sidebar is not collapsible
  // collapsible: VariantProps<typeof sidebarVariants>["collapsible"] // No longer needed
  // setCollapsed: (collapsed: boolean) => void // No longer needed
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
    Pick<SidebarProps, "variant" | "side"> & { // Removed collapsible and defaultCollapsed
      defaultOpenMobile?: boolean
    }
>(
  (
    {
      className,
      children,
      variant = "default",
      side = "left",
      // collapsible = "none", // Removed collapsible
      // defaultCollapsed, // Removed defaultCollapsed
      defaultOpenMobile,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [isOpenMobile, setIsOpenMobile] = React.useState(defaultOpenMobile ?? false)

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        variant,
        side,
        // collapsed: false, // Always false as it's not collapsible
        // collapsible: "none", // Always none
        // setCollapsed: () => {}, // No-op function
        isMobile,
        isOpenMobile,
        setIsOpenMobile,
      }),
      [variant, side, isMobile, isOpenMobile, setIsOpenMobile]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div ref={ref} className={cn("flex h-full w-full", className)} {...props}> {/* Ensure this wrapper is also full width */}
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
  const { variant, side, isMobile, isOpenMobile, setIsOpenMobile } = useSidebar()

  const commonProps = {
    ref,
    "data-sidebar": "sidebar",
    "data-variant": variant,
    "data-side": side,
    "data-collapsible": "none", // Explicitly none
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
        sidebarVariants({ variant, side, collapsible: "none" }), // Collapsible is now 'none'
        "flex flex-col h-full", // Ensure it takes full height
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
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex items-center p-2 shrink-0 h-14 justify-center px-3", // Removed border-b
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
      className={cn("flex flex-col gap-0.5 p-2", className)} // Removed p-2 for now
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
      isCollapsed: { // Will not be used since collapsible is 'none'
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
  tooltip?: React.ReactNode; // Tooltip is now less relevant for non-collapsible
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
    // const { isMobile } = useSidebar(); // isMobile not used for text hiding if always expanded
    const Comp = asChild ? Slot : Link;

    // Since sidebar is not collapsible, hideText logic for desktop is removed.
    // Text is always visible on desktop.
    const buttonChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).displayName?.includes('Icon')) {
         return React.cloneElement(child as React.ReactElement<any>, { className: cn("h-3 w-3", (child.props as any).className) });
      }
      return child;
    });

    const buttonContent = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: false }), // isCollapsed is false
          className
        )}
        href={href}
        {...props}
      >
        {buttonChildren}
      </Comp>
    );

    // Tooltip is now less relevant on desktop if sidebar is always expanded
    // but can still be useful for providing more info.
    if (tooltip) {
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
  tooltip?: React.ReactNode; // Tooltip less relevant
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  className?: string;
}

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
  const pathname = usePathname();

  // Temporarily commented out to test click behavior
  // React.useEffect(() => {
  //   setIsOpen(defaultOpen);
  // }, [defaultOpen, pathname]); // Re-evaluate if defaultOpen changes or route changes

  const contextValue = React.useMemo(() => ({
    isOpen,
    setIsOpen,
  }), [isOpen]);
const SidebarMenuSubTrigger = React.memo(React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubTriggerProps
>(
  (
    { className, children, isActive, tooltip, size = "default", ...props },
    ref
  ) => {
    const { isOpen, setIsOpen } = useSidebarMenuSub();

    const triggerChildren = React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        typeof child.type !== "string" &&
        (child.type as any).displayName?.includes("Icon")
      ) {
        return React.cloneElement(child as React.ReactElement<any>, {
          className: cn("h-3 w-3", (child.props as any).className),
        });
      }
      return child;
    });

    const buttonContent = (
      <button
        type="button"
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-state={isOpen ? "open" : "closed"}
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: false }), // isCollapsed is false
          "group/sub-trigger",
          className
        )}
        onClick={() => setIsOpen(!isOpen)} // Toggle the isOpen state
        {...props}
      >
        {triggerChildren}
      </button>
    );

    if (tooltip) {
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

  return ( // Note: This is the return for the component, not the useMemo
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
    const { isOpen, setIsOpen } = useSidebarMenuSub();

    const triggerChildren = React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        typeof child.type !== "string" &&
        (child.type as any).displayName?.includes("Icon")
      ) {
        return React.cloneElement(child as React.ReactElement<any>, {
          className: cn("h-3 w-3", (child.props as any).className),
        });
      }
      return child;
    });

    const buttonContent = (
      <button
        type="button"
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-state={isOpen ? "open" : "closed"}
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: false }), // isCollapsed is false
          "group/sub-trigger",
          className
        )}
        onClick={() => setIsOpen(!isOpen)} // Toggle the isOpen state
        {...props}
      >
        {triggerChildren}
      </button>
    );

    if (tooltip) {
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
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebarMenuSub();

  if (!isOpen) {
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
        "pl-4", // Indentation for submenu items
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
  HTMLDivElement,
  React.ComponentProps<"div"> & { noMargin?: boolean }
>(({ className, noMargin, children, ...props }, ref) => {
  // Margin logic removed as positioning is now handled by the main layout
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex-1 overflow-auto", // Takes remaining space
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
