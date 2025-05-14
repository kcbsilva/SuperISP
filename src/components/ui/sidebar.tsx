// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
        icon: "", // For icon-only collapse
        full: "" // For full collapse
      },
    },
    defaultVariants: {
      variant: "default",
      side: "left",
      collapsible: "icon",
    },
  }
)

const sidebarMobileVariants = cva(
  "fixed inset-y-0 z-50 h-full text-sidebar-foreground bg-background border-border shadow-xl transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
  {
    variants: {
      side: {
        left: "left-0 border-r",
        right: "right-0 border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0", // Adjust for right side
      },
    },
    defaultVariants: {
      side: "left",
    },
  }
)


interface SidebarProps
  extends React.HTMLAttributes<HTMLElement>, // Changed to HTMLElement as it's a <nav>
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
      collapsible = "icon", // Default to icon collapse
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
        setCollapsed(false) // Ensure sidebar is not collapsed on mobile
      }
    }, [isMobile])


    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        variant,
        side,
        collapsed: collapsible === 'none' ? false : collapsed, // Never collapsed if collapsible is 'none'
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
        <div ref={ref} className={cn("flex", className)} {...props}>
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"


const Sidebar = React.forwardRef<
  HTMLElement, // Changed to HTMLElement as it's a <nav>
  SidebarProps
>(({ className, asChild, children, ...props }, ref) => {
  const { variant, side, collapsed, collapsible, isMobile, isOpenMobile, setIsOpenMobile } = useSidebar()
  const Comp = asChild ? Slot : "nav"

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
        {isOpenMobile && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpenMobile(false)} />}
        <Comp
          className={cn(
            sidebarMobileVariants({ side }),
            variant === "inset" && "m-0 rounded-none border-none shadow-none",
            variant === "floating" && "m-0 rounded-none border-none shadow-none",
            className
          )}
          data-state={isOpenMobile ? "open" : "closed"}
          style={{ width: "var(--sidebar-width)" }}
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
        "flex items-center justify-between border-b p-2",
        hideText && "justify-center", // Center content when text is hidden
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
      className={cn("flex-1 overflow-auto", className)}
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
      className={cn("mt-auto border-t p-2", className)}
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


const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: React.ReactNode // Add tooltip prop
    size?: "default" | "sm" | "lg"
  }
>(
  (
    { className, asChild, isActive, children, tooltip, size = "default", ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { collapsed, collapsible, isMobile } = useSidebar()
    const hideText = collapsible !== 'none' && collapsed && !isMobile;

    const buttonChildren = (
      <>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === Link) {
            // If child is Link, clone it and its children
            return React.cloneElement(child, {
              ...child.props,
              className: cn("flex items-center gap-2", child.props.className),
              children: React.Children.map(child.props.children, (linkChild, linkChildIndex) => {
                if (React.isValidElement(linkChild) && typeof linkChild.type !== 'string') { // Check if it's a Lucide icon or similar component
                  return React.cloneElement(linkChild as React.ReactElement<any>, {
                    className: cn(linkChild.props.className, "h-4 w-4") // Apply icon size
                  });
                }
                if (typeof linkChild === 'string' && hideText) {
                  return null; // Hide text if collapsed
                }
                return linkChild;
              })
            });
          }
          if (React.isValidElement(child) && typeof child.type !== 'string') { // Icon
            return React.cloneElement(child as React.ReactElement<any>, {
              className: cn(child.props.className, "h-4 w-4") // Apply icon size
            });
          }
          if (typeof child === 'string' && hideText) { // Text
            return null
          }
          return child
        })}
      </>
    );

    const buttonContent = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        className={cn(
          "w-full justify-start rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
          "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
          isActive && "bg-muted text-primary font-semibold",
          hideText && "justify-center",
          size === "sm" && "px-2 py-1 text-xs",
          size === "lg" && "px-3 py-2 text-sm",
          className
        )}
        {...props}
      >
         {buttonChildren}
      </Comp>
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
SidebarMenuButton.displayName = "SidebarMenuButton"


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
          "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
          "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
          isActive && "bg-muted text-primary font-semibold",
          hideText && "justify-center",
          size === "sm" && "px-2 py-1 text-xs",
          size === "lg" && "px-3 py-2 text-sm",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {React.Children.map(children, (child, index) => {
             if (React.isValidElement(child) && typeof child.type !== 'string') { // Icon
                return React.cloneElement(child as React.ReactElement<any>, {
                  className: cn(child.props.className, "h-4 w-4") // Apply icon size
                });
              }
              if (typeof child === 'string' && hideText) { // Text
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
  React.HTMLAttributes<HTMLDivElement> & { "data-state"?: "open" | "closed" } // For Radix Accordion compatibility
>(({ className, children, ...props }, ref) => {
  const { collapsed, collapsible } = useSidebar()

  return (
    <div
      ref={ref}
      data-sidebar="menu-sub-content"
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        collapsible !== 'none' && collapsed ? "max-h-0" : "max-h-[--radix-accordion-content-height] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
        collapsible !== 'none' && collapsed && "pl-0", // No padding when collapsed
        collapsible === 'none' && "", // No specific styles for non-collapsible
        !(collapsible !== 'none' && collapsed) && "pl-4", // Indent content when not collapsed
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
  return (
    <hr
      ref={ref}
      data-sidebar="separator"
      className={cn("my-1 border-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main"> & { noMargin?: boolean }
>(({ className, noMargin, ...props }, ref) => {
  const { collapsed, collapsible, isMobile } = useSidebar();

  const marginClass = React.useMemo(() => {
    if (isMobile || noMargin) return '';
    if (collapsible === 'none') return 'md:ml-[var(--sidebar-width)]';
    return collapsed ? 'md:ml-[var(--sidebar-width-icon)]' : 'md:ml-[var(--sidebar-width)]';
  }, [collapsed, collapsible, isMobile, noMargin]);

  return (
    <main
      ref={ref}
      className={cn(
        "relative flex-1 overflow-auto transition-[margin-left] duration-300 ease-in-out",
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