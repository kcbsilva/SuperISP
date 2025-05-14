// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile" // Corrected import path
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";

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
        none: "",
        icon: "", 
        full: "" 
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
      collapsible = "full", // Default to full collapse
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
        setCollapsed(false) // On mobile, sidebar is not "collapsed" in the desktop sense
      }
    }, [isMobile])


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
>(({ className, asChild, children, ...props }, ref) => {
  const { variant, side, collapsed, collapsible, isMobile, isOpenMobile, setIsOpenMobile } = useSidebar()
  const Comp = asChild ? Slot : "nav"

  const commonProps = {
    ref,
    "data-sidebar": "sidebar",
    "data-variant": variant,
    "data-side": side,
    "data-collapsed": collapsible === 'none' ? false : collapsed,
    "data-collapsible": collapsible,
    ...props,
  }

  if (isMobile) {
    return (
      <>
        {isOpenMobile && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpenMobile(false)} />}
        <Comp
          className={cn(
            sidebarMobileVariants({ side }),
            "w-[var(--sidebar-width)]", // Use full width for mobile
            variant === "inset" && "m-0 rounded-none border-none shadow-none",
            variant === "floating" && "m-0 rounded-none border-none shadow-none",
            className
          )}
          data-state={isOpenMobile ? "open" : "closed"}
          {...commonProps}
        >
          {children}
        </Comp>
      </>
    )
  }

  return (
    <Comp
      className={cn(
        sidebarVariants({ variant, side, collapsible }),
        "flex flex-col",
        // Apply width based on collapsible state
        collapsible === 'none' ? "w-[var(--sidebar-width)]" : (collapsed ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]"),
        (variant === "floating" || variant === "inset") && "p-2",
        className
      )}
      {...commonProps}
    >
      {children}
    </Comp>
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
        "flex items-center border-b p-2 shrink-0 h-12",
        hideText ? "justify-center" : "justify-between",
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
        sm: "px-2 py-1 text-xs",
        lg: "px-3 py-2 text-sm",
      },
      isCollapsed: {
        true: "justify-center",
      },
    },
    defaultVariants: {
      isActive: false,
      size: "default",
      isCollapsed: false,
    },
  }
);


const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement, // Changed to HTMLAnchorElement as Link's asChild will render an 'a'
  React.ComponentProps<typeof Link> & { // Use Link props
    isActive?: boolean
    tooltip?: React.ReactNode
    size?: "default" | "sm" | "lg"
  }
>(
  (
    { className, isActive, children, tooltip, size = "default", ...props },
    ref
  ) => {
    const { collapsed, collapsible, isMobile } = useSidebar();
    const hideText = collapsible !== 'none' && collapsed && !isMobile;

    // Ensure Link is the direct child if asChild is used elsewhere,
    // but here we render Link directly.
    const buttonElement = (
      <Link
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText }),
          className
        )}
        {...props} // Spread props to Link (includes href, etc.)
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type !== 'string') { // Icon
            return React.cloneElement(child as React.ReactElement<any>, {
              className: cn(child.props.className, "h-4 w-4") // Ensure icon size consistency
            });
          }
          if (typeof child === 'string' && hideText) { // Text
            return null;
          }
          return child;
        })}
      </Link>
    );
    

    if (hideText && tooltip) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
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
  React.HTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean
    tooltip?: React.ReactNode
    size?: "default" | "sm" | "lg"
  }
>(
  (
    { className, children, isActive, tooltip, size = "default", ...props },
    ref
  ) => {
    const { collapsed, collapsible, isMobile } = useSidebar()
    const hideText = collapsible !== 'none' && collapsed && !isMobile;


    const buttonContent = (
      <button
        ref={ref}
        data-sidebar="menu-sub-trigger"
        data-size={size}
        className={cn(
          sidebarMenuButtonVariants({ isActive, size, isCollapsed: hideText }),
          "justify-between", 
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 flex-1">
          {React.Children.map(children, (child) => {
             if (React.isValidElement(child) && typeof child.type !== 'string') {
                return React.cloneElement(child as React.ReactElement<any>, {
                  className: cn(child.props.className, "h-4 w-4")
                });
              }
              if (typeof child === 'string' && hideText) {
                return null
              }
              return child
          })}
        </div>
        {!hideText && (
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        )}
      </button>
    )

    if (hideText && tooltip) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
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

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub-content"
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        collapsible !== 'none' && collapsed ? "max-h-0" : "max-h-[--radix-accordion-content-height] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
        collapsible !== 'none' && collapsed && "pl-0", // No padding when fully collapsed
        collapsible === 'none' && "", // Default state for non-collapsible
        !(collapsible !== 'none' && collapsed) && "pl-4", // Padding for expanded or icon-only
        className
      )}
      {...props}
    >
      <ul className="flex flex-col gap-0.5 py-1">{children}</ul>
    </div>
  )
})
SidebarMenuSubContent.displayName = "SidebarMenuSubContent"


const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar();
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
  const { collapsed, collapsible, isMobile, side, variant } = useSidebar();

  const marginClass = React.useMemo(() => {
    if (noMargin) return ''; 
     // For desktop, adjust margin based on sidebar state
     const desktopMarginValue = collapsible === 'none' 
       ? 'var(--sidebar-width)' 
       : collapsed 
         ? 'var(--sidebar-width-icon)' 
         : 'var(--sidebar-width)';
     
     if (side === 'left') {
        return `md:ml-[${desktopMarginValue}]`;
     } else {
        return `md:mr-[${desktopMarginValue}]`;
     }
   }, [collapsed, collapsible, isMobile, noMargin, side]);


  return (
    <main
      ref={ref}
      className={cn(
        "relative flex-1 overflow-auto transition-[margin] duration-300 ease-in-out",
        noMargin ? "p-0" : "md:ml-5", // Always apply consistent padding, margin handled by marginClass
        marginClass,
        className
      )}
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
