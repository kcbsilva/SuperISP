// src/app/admin/forgot-password/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/services/supabase/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes'; // Added for ProlterLogo
import { Separator } from '@/components/ui/separator'; // Added for consistency

// Define ProlterLogo component (copied from login page for now)
function ProlterLogo(props: React.SVGProps<SVGSVGElement> & { fixedColor?: string }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  const { fixedColor, ...restProps } = props;
  React.useEffect(() => { setIsMounted(true); }, []);
  let fillColor = "hsl(var(--foreground))";
  if (fixedColor) { fillColor = fixedColor; }
  else if (isMounted) { fillColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))"; }
  if (!isMounted && !fixedColor) { return <div style={{ width: props.width || "131px", height: props.height || "32px" }} />; }
  return (
    <div style={{ width: props.width || '131px', height: props.height || '32px' }} className="flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 131 32" xmlns="http://www.w3.org/2000/svg" fill={fillColor} {...restProps}>
        <text x="50%" y="50%" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">PROLTER</text>
      </svg>
    </div>
  );
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setMessage('');

    // IMPORTANT: Configure this redirect URL in your Supabase project settings!
    // Authentication -> URL Configuration -> Redirect URLs
    // Add: http://localhost:3000/admin/update-password (or your production URL)
    const redirectTo = `${window.location.origin}/admin/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: redirectTo,
    });

    if (error) {
      toast({
        title: t('forgot_password.error_title', "Error"),
        description: error.message || t('forgot_password.error_description', "Failed to send password reset email."),
        variant: 'destructive',
      });
    } else {
      setMessage(t('forgot_password.success_description', "If an account exists for this email, a password reset link has been sent."));
      toast({
        title: t('forgot_password.success_title', "Check Your Email"),
        description: t('forgot_password.success_description', "If an account exists for this email, a password reset link has been sent."),
      });
      form.reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
      <Card className="w-full max-w-sm bg-[#233B6E] border-2 border-accent text-gray-200">
        <CardHeader className="items-center pt-8 pb-4">
          <ProlterLogo fixedColor="hsl(var(--accent))" />
          <CardTitle className="text-xl text-accent pt-4">{t('forgot_password.title', "Forgot Password?")}</CardTitle>
          <CardDescription className="text-gray-300 text-center px-2">
            {t('forgot_password.description', "Enter your email address and we'll send you a link to reset your password.")}
          </CardDescription>
          <Separator className="my-2 bg-accent" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="text-gray-200">{t('forgot_password.email_label', "Email Address")}</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('forgot_password.email_placeholder', "you@example.com")}
                        className="bg-background/10 text-gray-200 placeholder:text-gray-400 border-primary-foreground/30 focus:border-accent"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              {message && <p className="text-xs text-green-400">{message}</p>}
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? t('forgot_password.submitting_button', "Sending...") : t('forgot_password.submit_button', "Send Reset Link")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs pt-4 pb-6">
          <Link href="/admin/login" className="hover:underline text-accent">
            {t('forgot_password.back_to_login', "Back to Login")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
