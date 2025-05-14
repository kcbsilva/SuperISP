// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
// Assuming Bootstrap's JS is available for collapse functionality if not using React-Bootstrap
// For Tooltip, ensure Bootstrap's JS for tooltips is initialized if using data-bs-toggle attributes


// Sidebar Context (Simplified for Bootstrap)
type SidebarContextValue = {
  isMobile: boolean
  isOpenMobile: boolean
  setIsOpenMobile: (open: boolean) => void
  // Collapsed state is removed for now as per previous request to simplify
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

// Sidebar Provider
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    // Props like side, variant, collapsible are removed to simplify for Bootstrap direct usage
  }
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [isOpenMobile, setIsOpenMobile] = React.useState(false);

  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({
      isMobile,
      isOpenMobile,
      setIsOpenMobile,
    }),
    [isMobile, isOpenMobile]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div ref={ref} className={cn("d-flex", className)} {...props}> {/* Main flex container */}
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";


// Sidebar Component
const Sidebar = React.forwardRef<
  HTMLElement, // Changed to HTMLElement as it's a <nav>
  React.HTMLAttributes<HTMLElement> // Changed to HTMLElement
>(({ className, children, ...props }, ref) => {
  const { isMobile, isOpenMobile, setIsOpenMobile } = useSidebar();

  // Dynamic classes for mobile offcanvas
  const offcanvasClasses = isMobile
    ? `offcanvas offcanvas-start${isOpenMobile ? ' show' : ''}`
    : 'sticky-top vh-100'; // Sticky for desktop

  const sidebarWidth = isMobile ? '280px' : '220px'; // Example widths

  return (
    <>
      {isMobile && isOpenMobile && <div className="offcanvas-backdrop fade show" onClick={() => setIsOpenMobile(false)}></div>}
      <nav
        ref={ref}
        id="nethubSidebar"
        className={cn(
          "d-flex flex-column flex-shrink-0 p-3 bg-light text-dark",
          offcanvasClasses,
          className
        )}
        style={{ width: sidebarWidth, transition: isMobile ? 'transform .3s ease-in-out' : undefined }}
        tabIndex={isMobile ? -1 : undefined}
        aria-labelledby={isMobile ? "nethubSidebarLabel" : undefined}
        {...props}
      >
        {children}
      </nav>
    </>
  );
});
Sidebar.displayName = "Sidebar";


// SidebarHeader (Simplified for Bootstrap)
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("mb-3", className)} {...props}>
    {children}
  </div>
));
SidebarHeader.displayName = "SidebarHeader";

// SidebarContent (Simplified for Bootstrap)
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex-grow-1 overflow-auto", className)} {...props}>
    {children}
  </div>
));
SidebarContent.displayName = "SidebarContent";

// SidebarFooter (Simplified for Bootstrap)
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("mt-auto pt-3", className)} {...props}>
    {children}
  </div>
));
SidebarFooter.displayName = "SidebarFooter";

// SidebarMenu (ul with Bootstrap nav classes)
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, children, ...props }, ref) => (
  <ul ref={ref} className={cn("nav nav-pills flex-column mb-auto", className)} {...props}>
    {children}
  </ul>
));
SidebarMenu.displayName = "SidebarMenu";

// SidebarMenuItem (li with Bootstrap nav-item class)
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => (
  <li ref={ref} className={cn("nav-item", className)} {...props}>
    {children}
  </li>
));
SidebarMenuItem.displayName = "SidebarMenuItem";

// SidebarMenuButton (a or button with Bootstrap nav-link class)
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement, // Can also be HTMLAnchorElement if Link is used
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    isActive?: boolean;
    // Tooltip props would be handled by Bootstrap's data attributes if using Bootstrap's Tooltip JS
  }
>(({ className, asChild, isActive, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const activeClass = isActive ? "active" : "";
  return (
    <Comp
      ref={ref}
      className={cn("nav-link text-dark d-flex align-items-center gap-2", activeClass, className)}
      type={asChild ? undefined : "button"} // Ensure button type if not asChild
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

// SidebarMenuSub (Wrapper for collapsible content - needs Bootstrap collapse JS)
const SidebarMenuSub = React.forwardRef<
  HTMLDivElement, // This will be the collapsible div
  React.HTMLAttributes<HTMLDivElement> & { id: string } // Requires an ID for Bootstrap collapse
>(({ className, children, id, ...props }, ref) => (
  <div ref={ref} className={cn("collapse", className)} id={id} {...props}>
    <ul className="nav nav-pills flex-column ps-3"> {/* Indented sub-menu items */}
        {children}
    </ul>
  </div>
));
SidebarMenuSub.displayName = "SidebarMenuSub";


// SidebarMenuSubTrigger (Button that controls Bootstrap collapse)
const SidebarMenuSubTrigger = React.forwardRef<
  HTMLButtonElement, // Or HTMLAnchorElement
  React.ButtonHTMLAttributes<HTMLButtonElement> & { // Or React.AnchorHTMLAttributes
    targetCollapseId: string;
    isActive?: boolean;
    asChild?: boolean;
  }
>(({ className, children, targetCollapseId, isActive, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const activeClass = isActive ? "active" : "";
    const collapsedClass = isActive ? "" : "collapsed"; // Bootstrap uses 'collapsed' when trigger is not expanded

    return (
        <Comp
        ref={ref}
        className={cn("nav-link text-dark d-flex align-items-center justify-content-between w-100", activeClass, collapsedClass, className)}
        type="button" // Ensure it's a button for accessibility with collapse
        data-bs-toggle="collapse"
        data-bs-target={`#${targetCollapseId}`}
        aria-expanded={isActive ? "true" : "false"}
        aria-controls={targetCollapseId}
        {...props}
        >
        <span className="d-flex align-items-center gap-2">{children}</span>
        <ChevronDown className="ms-auto transition-transform" style={{transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)'}}/>
        </Comp>
    );
});
SidebarMenuSubTrigger.displayName = "SidebarMenuSubTrigger";


// SidebarMenuSubContent (This component might not be directly needed if SidebarMenuSub handles collapse directly)
// For simplicity, children of SidebarMenuSub will render directly inside the collapsible div.
// If specific styling for content area is needed, this can be a simple div wrapper.
const SidebarMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props}>
    {children}
  </div>
));
SidebarMenuSubContent.displayName = "SidebarMenuSubContent";


// SidebarSeparator (hr with Bootstrap margin utility)
const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr ref={ref} className={cn("my-2", className)} {...props} />
));
SidebarSeparator.displayName = "SidebarSeparator";

// SidebarInset
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main"> & { noMargin?: boolean }
>(({ className, noMargin, ...props }, ref) => {
  const { isMobile } = useSidebar();
  // Bootstrap's margin utility classes (e.g., ms-md-auto, me-md-auto, or specific like 'ms-md-4')
  // This example assumes the sidebar is on the left.
  const marginClass = !isMobile && !noMargin ? "ms-md-3" : ""; // ml-5 in Tailwind, approx ms-3 or ms-4 in Bootstrap

  return (
    <main
      ref={ref}
      className={cn(
        "flex-grow-1 position-relative", // Bootstrap flex-grow and position
        marginClass,
        className
      )}
      style={{ transition: 'margin-left .3s ease-in-out' }} // Smooth transition for margin change
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";


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
  // Note: SidebarTrigger, SidebarInput, SidebarGroup, etc. were removed for Bootstrap simplification.
  // They can be re-added with Bootstrap styling if specific structures are needed.
};
