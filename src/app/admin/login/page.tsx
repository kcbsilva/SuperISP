//src/app/admin/login/page.tsx
'use client';
import * as React from "react";
import { useState, useEffect, type SVGProps } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
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
import { Loader2 } from "lucide-react"; // Import Loader2

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
    fillColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  }

  if (!isMounted && !fixedColor) {
    return <div style={{ width: props.width || "131px", height: props.height || "32px" }} />;
  }

  return (
    <div style={{ width: props.width || '131px', height: props.height || '32px' }} className="flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 131 32"
        xmlns="http://www.w3.org/2000/svg"
        fill={fillColor}
        {...restProps}
      >
        <text
          x="50%"
          y="50%"
          fontFamily="Arial, sans-serif"
          fontSize="24"
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
  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [publicIP, setPublicIP] = useState<string | null>(null);
  const [ipLoading, setIpLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams(); // For getting redirect_url
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state for form submission


  useEffect(() => {
    if (!authIsLoading && isAuthenticated) {
      const redirectUrl = searchParams.get('redirect_url') || '/admin/dashboard';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, authIsLoading, router, searchParams]);

  useEffect(() => {
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
  }, []);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true); // Start local loading

    try {
      const redirectUrl = searchParams.get('redirect_url') || '/admin/dashboard';
      await login(email, password, redirectUrl); // Call Supabase login from context
      // Redirect is handled by the useEffect above or by AuthContext on successful login
    } catch (loginError: any) {
      // Check for the specific "Email not confirmed" error key
      if (loginError.message === 'auth.email_not_confirmed') {
        setError(t('auth.email_not_confirmed_error', 'Your email address has not been confirmed. Please check your inbox (and spam folder) for a confirmation link.'));
      } else {
        setError(loginError.message || t('login.error_failed', 'Login failed. Please check your credentials.'));
      }
    } finally {
      setIsSubmitting(false); // Stop local loading
    }
  };

  if (authIsLoading && !isSubmitting) { // Show main loader only if not already in form submission
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

  // This case should ideally be handled by LayoutRenderer or the useEffect hook for redirection
  // if (isAuthenticated) {
  //   return (
  //     <div className="flex min-h-screen w-full items-center justify-center bg-black">
  //       <p className="text-primary-foreground">{t('auth.redirecting', 'Redirecting to dashboard...')}</p>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen w-full bg-black">
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
                <Label htmlFor="email" className="text-gray-200">{t("login.username_label", "Email")}</Label>
                <Input
                  id="email"
                  type="email" // Changed from text to email
                  className="bg-background/10 text-gray-200 placeholder:text-gray-400 border-primary-foreground/30 focus:border-accent"
                  placeholder={t("login.username_placeholder", "Enter your email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || authIsLoading}
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
                  disabled={isSubmitting || authIsLoading}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting || authIsLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? t('login.loading', 'Signing In...') : t("login.submit_button", "Sign In")}
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
