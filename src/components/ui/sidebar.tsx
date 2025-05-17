
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
        setCollapsedInternal(false); // Ensure collapsed is always false if not collapsible
      }
    }, [collapsible]);

    // Ensure collapsed is false if collapsible is 'none'
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
        <div ref={ref} className={cn(className)} {...props}>
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
    "data-collapsed": collapsed,
    "data-collapsible": currentCollapsibleMode,
    ...props,
  }

  if (isMobile) {
    return (
      <>
        {isOpenMobile && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpenMobile(false)} />}
        <nav
          className={cn(
            sidebarMobileVariants({ side }),
            "w-[var(--sidebar-width)]",
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
  const { collapsed, collapsible } = useSidebar()
  const hideText = collapsible !== 'none' && collapsed;
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex items-center p-2 shrink-0 h-14",
        hideText ? "justify-center px-0" : "justify-center px-3",
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
  const { collapsed, collapsible } = useSidebar()
  const hideText = collapsible !== 'none' && collapsed;
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("mt-auto border-t p-2 shrink-0 h-14 flex items-center", 
      hideText ? "justify-center" : "justify-between",
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
  const { collapsed, collapsible } = useSidebar()
  const hideText = collapsible !== 'none' && collapsed;
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex flex-col gap-0.5",
       hideText ? "px-0" : "p-2",
       className)}
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
  "w-full justify-start rounded-md px-2.5 py-1.5 text-left text-xs transition-colors flex items-center gap-2 hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      isActive: {
        true: "bg-muted text-primary font-semibold",
      },
      isCollapsed: { // New variant for collapsed state
        true: "[&>span:not(.sr-only)]:sr-only justify-center px-0", // Hide text and center icon
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
        {children}
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
}

const SidebarMenuSubContext = React.createContext<{
  isOpen: boolean;
  toggleOpen: () => void;
} | null>(null);

function useSidebarMenuSub() {
  const context = React.useContext(SidebarMenuSubContext);
  if (!context) {
    throw new Error("useSidebarMenuSub must be used within a SidebarMenuSub");
  }
  return context;
}

const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }
>(({ className, children, defaultOpen = false, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const { collapsed, collapsible } = useSidebar();

  React.useEffect(() => {
    if (collapsible !== 'none' && collapsed) {
      setIsOpen(false); // Collapse submenus when sidebar collapses
    }
  }, [collapsed, collapsible]);


  const toggleOpen = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const contextValue = React.useMemo(() => ({
    isOpen,
    toggleOpen,
  }), [isOpen, toggleOpen]);

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
    const { toggleOpen, isOpen } = useSidebarMenuSub();
    const { collapsed, collapsible, isMobile } = useSidebar();
    const hideText = collapsible !== 'none' && collapsed;


    const buttonContent = (
      <button
        type="button"
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-state={isOpen ? "open" : "closed"}
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText && !isMobile }),
          "group/sub-trigger",
          className
        )}
        onClick={toggleOpen}
        {...props}
      >
        {children}
      </button>
    )

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
      )
    }
    return buttonContent
  }
));
SidebarMenuSubTrigger.displayName = "SidebarMenuSubTrigger"


const SidebarMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebarMenuSub();
  const { collapsed, collapsible } = useSidebar();

  if (!isOpen || (collapsible !== 'none' && collapsed)) {
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
SidebarMenuSubContent.displayName = "SidebarMenuSubContent"


const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar()
  const hideText = collapsible !== 'none' && collapsed;
  if (hideText) return null
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
  React.ComponentProps<"main"> & { noMargin?: boolean }
>(({ className, noMargin, ...props }, ref) => {
   const { side, collapsed, collapsible } = useSidebar();
  
   const marginStyle = React.useMemo(() => {
     if (noMargin) return {};
     const isIconMode = collapsible !== 'none' && collapsed;
     const sidebarWidth = isIconMode ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)';
     
     if (side === 'left') {
        return { marginLeft: sidebarWidth, padding: '0.5rem' }; // p-2 equivalent
     } else {
        return { marginRight: sidebarWidth, padding: '0.5rem' }; // p-2 equivalent
     }
   }, [side, collapsed, collapsible, noMargin]);


  return (
    <main
      ref={ref}
      className={cn(
        "relative flex-1 overflow-auto",
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

