'use client';
import * as React from "react";
import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { ProlterLogo } from '@/components/prolter-logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [publicIP, setPublicIP] = useState<string | null>(null);
  const [ipLoading, setIpLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState("/admin/dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const { t } = useLocale();

  // Get redirect_url from query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect_url");
      if (redirect && redirect.startsWith("/admin")) {
        setRedirectUrl(redirect);
      }
    }
  }, []);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setPublicIP(data.ip || "Unavailable");
        setIpLoading(false);
      })
      .catch((e) => {
        console.error("IP fetch error:", e);
        setPublicIP("Unavailable");
        setIpLoading(false);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password, redirectUrl);
    } catch (loginError: any) {
      if (loginError.message === 'auth.email_not_confirmed') {
        setError(t('auth.email_not_confirmed_error', 'Your email address has not been confirmed. Please check your inbox (and spam folder) for a confirmation link.'));
      } else {
        setError(loginError.message || t('login.error_failed', 'Login failed. Please check your credentials.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authIsLoading && !isSubmitting) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-3 w-3 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-3 w-3 bg-foreground rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Branding section */}
      <div className="hidden lg:flex lg:w-3/4 bg-muted flex-col items-center justify-center p-12 text-center">
        <ProlterLogo width="200" height="48" />
        <h1 className="mt-8 text-3xl font-bold text-primary">
          {t("login.welcome_title", "Welcome to Prolter ISP")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t("login.welcome_subtitle", "Manage your services efficiently and effectively.")}
        </p>
        <div className="mt-8 w-full max-w-md aspect-video relative">
          <Image
            src="https://placehold.co/600x400.png"
            alt="ISP Management Illustration"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* Login form */}
      <div className="w-full lg:w-1/4 flex justify-center items-center bg-card p-4 md:p-8">
        <Card className="w-full max-w-xs bg-card border text-card-foreground shadow-lg">
          <CardHeader className="items-center pt-8 pb-4">
            <div className="lg:hidden mb-4">
              <ProlterLogo />
            </div>
            <CardTitle className="text-xl text-primary pt-4 lg:pt-0">
              {t("login.title", "Admin Login")}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center px-2">
              {t("login.description", "Enter your credentials to access the admin panel.")}
            </CardDescription>
            <Separator className="my-2 bg-border" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("login.username_label", "Email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.username_placeholder", "Enter your email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || authIsLoading}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">{t("login.password_label", "Password")}</Label>
                  <Link href="/admin/forgot-password" className="text-xs text-primary hover:underline">
                    {t("login.forgot_password", "Forgot Password?")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("login.password_placeholder", "Enter your password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting || authIsLoading}
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isSubmitting || authIsLoading}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? t('login.loading', 'Signing In...') : t("login.submit_button", "Sign In")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center items-center text-xs pt-4 pb-6 px-6">
            <div className="text-muted-foreground">
              {t("login.your_ip", "Your IP:")}&nbsp;
              {ipLoading ? (
                <Skeleton className="h-3 w-20 inline-block bg-muted" />
              ) : (
                <span className="font-medium text-foreground">{publicIP}</span>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
