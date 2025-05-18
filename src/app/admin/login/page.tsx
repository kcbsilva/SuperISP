
//src/app/admin/login/page.tsx
'use client';
import * as React from "react";
import { useState, useEffect, type SVGProps } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/contexts/LocaleContext";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useTheme } from "next-themes";

// Define ProlterLogo component directly in this file
function ProlterLogo(props: SVGProps<SVGSVGElement> & { fixedColor?: string }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  const { fixedColor, ...restProps } = props;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  let fillColor = "hsl(var(--foreground))"; // Default
  if (fixedColor) {
    fillColor = fixedColor;
  } else if (isMounted) {
    // For the general ProlterLogo, it adapts to the theme
    // Dark theme: Accent color (Orange/Amber #FCA311)
    // Light theme: Primary color (Dark Blue #14213D, adjusted to #233B6E based on globals)
    fillColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  }

  if (!isMounted && !fixedColor) {
    return <div style={{ width: "131px", height: "32px" }} />;
  }

  return (
    <div style={{ width: '131px', height: '32px' }} className="flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 131 32"
        xmlns="http://www.w3.org/2000/svg"
        fill={fillColor}
        {...restProps}
      >
        {/* Placeholder SVG - REPLACE THIS with your actual SVG code */}
        <text
          x="50%"
          y="50%"
          fontFamily="Arial, sans-serif"
          fontSize="24" // Increased font size for better visibility as a logo
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PROLTER
        </text>
      </svg>
    </div>
  );
};


export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [publicIP, setPublicIP] = useState<string | null>(null);
  const [ipLoading, setIpLoading] = useState(true);
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const { t } = useLocale();

  useEffect(() => {
    if (!authIsLoading && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    console.log("Auth State: isLoading:", authIsLoading, "isAuthenticated:", isAuthenticated);
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setPublicIP(data.ip);
        setIpLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching IP:", e);
        setPublicIP("N/A");
        setIpLoading(false);
      });
  }, []); // Removed dependencies to run only once on mount for IP fetching


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const DEMO_USERNAME = 'demo';
    const DEMO_PASSWORD = 'demo';

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      login(); // AuthContext's login handles redirect to /admin/dashboard
      return;
    }
    
    setError(t('login.error_failed', 'Login failed. Please check your credentials.'));
  };

  if (authIsLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 bg-foreground rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (!authIsLoading && isAuthenticated) {
    // This state should ideally be brief as useEffect above should redirect.
    // Display a "Redirecting..." message or a minimal loader if preferred.
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <p className="text-primary-foreground">{t('auth.redirecting', 'Redirecting to dashboard...')}</p>
      </div>
    );
  }


  // Only render the login form if not loading and not authenticated
  return (
    <div className="flex min-h-screen w-full bg-black">
      {/* Left Decorative Panel (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-3/4 bg-black items-center justify-center p-8">
        <div className="text-center">
           <h1 className="text-4xl font-bold text-primary-foreground">
             {t("login.welcome_title", "Welcome to Prolter ISP")}
           </h1>
           <p className="mt-2 text-muted-foreground">
             {t("login.welcome_subtitle", "Manage your services efficiently.")}
           </p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/4 flex justify-center items-center bg-black p-4 md:p-8">
        <Card className="w-full max-w-xs bg-[#233B6E] border-2 border-accent text-gray-200">
          <CardHeader className="items-center pt-8 pb-4">
            <ProlterLogo fixedColor="hsl(var(--accent))" />
            <CardTitle className="text-xl text-accent pt-4">
              {t("login.title", "Admin Login")}
            </CardTitle>
            <CardDescription className="text-gray-300 text-center px-2">
              {t(
                "login.description",
                "Enter your credentials to access the admin panel."
              )}
            </CardDescription>
             <Separator className="my-2 bg-accent" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-gray-200">{t("login.username_label", "Username")}</Label>
                <Input
                  id="username"
                  type="text"
                  className="bg-background/10 text-gray-200 placeholder:text-gray-400 border-primary-foreground/30 focus:border-accent"
                  placeholder={t("login.username_placeholder", "Enter your username")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-gray-200">{t("login.password_label", "Password")}</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-background/10 text-gray-200 placeholder:text-gray-400 border-primary-foreground/30 focus:border-accent"
                  placeholder={t("login.password_placeholder", "Enter your password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {t("login.submit_button", "Sign In")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-xs pt-4 pb-6 px-6">
            <div className="text-gray-300">
              {t("login.your_ip", "Your IP:")}{" "}
              {ipLoading ? (
                <Skeleton className="h-3 w-20 inline-block bg-primary-foreground/20" />
              ) : (
                <span className="font-medium text-gray-100">{publicIP}</span>
              )}
            </div>
            <Link href="#" className="hover:underline text-accent">
              {t("login.forgot_password", "Forgot Password?")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

