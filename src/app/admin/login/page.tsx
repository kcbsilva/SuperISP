//src/app/admin/login/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
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
import { useLocale } from "@/contexts/LocaleContext"; // For translations
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For displaying login errors
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth(); // Use auth context
  const { t } = useLocale();

  useEffect(() => {
    // If already authenticated and not loading, redirect from login page
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    // Demo user credentials
    const DEMO_USERNAME = 'demo';
    const DEMO_PASSWORD = 'demo';

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      login('/'); // Call login from AuthContext for demo user
      return;
    }
    
    setError(t('login.error_failed', 'Login failed. Please check your credentials.'));
  };

  if (isLoading || (!isLoading && isAuthenticated)) {
    // Show a loading spinner or null while checking auth or if redirecting
    return (
      <div className="flex min-h-screen w-full"> {/* Full width container for two-column layout */}
        {/* Optional: Add a skeleton for the left panel if desired */}
        {/* <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-8">
          <Skeleton className="h-20 w-3/4" />
        </div> */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8"> {/* Ensure this div is present for centering the card */}
          <Card className="w-full max-w-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" /> {/* Skeleton for Title */}
              <Skeleton className="h-4 w-full" /> {/* Skeleton for Description */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-1/4" /> {/* Skeleton for Label */}
                <Skeleton className="h-8 w-full" /> {/* Skeleton for Input */}
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-1/4" /> {/* Skeleton for Label */}
                <Skeleton className="h-8 w-full" /> {/* Skeleton for Input */}
              </div>
              <Skeleton className="h-9 w-full" /> {/* Skeleton for Button */}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel (e.g., for branding, image) - takes up half the screen */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-8">
        {/* You can add an image or branding text here */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">{t("login.welcome_title", "Welcome to Prolter ISP")}</h1>
          <p className="mt-2 text-muted-foreground">{t("login.welcome_subtitle", "Manage your services efficiently.")}</p>
        </div>
      </div>

      {/* Right Panel (Login Form) - takes up half the screen on large devices, full width on smaller */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-background p-4 md:p-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              {t("login.title", "Admin Login")}
            </CardTitle>
            <CardDescription>
              {t(
                "login.description",
                "Enter your credentials to access the admin panel."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">
                  {t("login.username_label", "Username")}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("login.username_placeholder", "Enter your username")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">
                  {t("login.password_label", "Password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("login.password_placeholder", "Enter your password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                {t("login.submit_button", "Sign In")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
