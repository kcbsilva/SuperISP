
// src/app/admin/update-password/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';
// Removed useAuth import as its isLoading state is for the main session, not this specific flow.

// Define ProlterLogo component
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

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [pageIsLoading, setPageIsLoading] = React.useState(true); // Local loading state for this page
  const [isRecoveryContextActive, setIsRecoveryContextActive] = React.useState(false); // Tracks if Supabase processed the recovery token

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  React.useEffect(() => {
    // This effect sets up the listener for auth state changes, crucial for PASSWORD_RECOVERY.
    // It runs once on mount due to the `[t]` dependency array (assuming `t` is stable).
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (pageIsLoading) {
        setPageIsLoading(false); // First auth event processed, page is no longer in initial loading state.
      }

      if (event === 'PASSWORD_RECOVERY') {
        setMessage(t('update_password.ready_to_update'));
        setError('');
        setIsRecoveryContextActive(true); // Recovery context is active, form can be enabled.
      } else if (session && event === 'SIGNED_IN' && !isRecoveryContextActive) {
        // User is regularly signed in (not via recovery link).
        // LayoutRenderer should ideally redirect. If they land here, show error.
        setError(t('update_password.error_already_logged_in', "You are already logged in. Password reset is for logged-out users."));
        setIsRecoveryContextActive(false);
      } else if (!session && event !== 'INITIAL_SESSION' && !isRecoveryContextActive) {
        // No session, not an initial check, and recovery context not active.
        // This likely means the token was invalid or expired.
        setError(t('update_password.error_invalid_token', "Invalid or expired password reset link. Please request a new one."));
        setMessage('');
        setIsRecoveryContextActive(false);
      }
    });
    
    // Additionally, check session on mount. This helps set pageIsLoading correctly
    // if onAuthStateChange is slightly delayed or if Supabase client processes URL hash immediately.
    supabase.auth.getSession().then(({ data }) => {
        if (pageIsLoading) {
            setPageIsLoading(false);
        }
        // The PASSWORD_RECOVERY event is the primary trigger for enabling the form.
        // getSession might not fully reflect the special recovery state immediately.
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [t]); // `t` is from useLocale, should be stable.

  const onSubmit = async (data: UpdatePasswordFormData) => {
    if (!isRecoveryContextActive) {
      setError(t('update_password.error_invalid_token', "Cannot update password. Recovery session not active."));
      return;
    }
    setIsSubmitting(true);
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (updateError) {
      setError(updateError.message || t('update_password.error_description_generic', "Failed to update password."));
      toast({
        title: t('update_password.error_title', "Error"),
        description: updateError.message || t('update_password.error_description_generic', "Failed to update password."),
        variant: 'destructive',
      });
    } else {
      setMessage(t('update_password.success_description', "Your password has been updated successfully. You can now log in."));
      toast({
        title: t('update_password.success_title', "Password Updated"),
        description: t('update_password.success_description', "Your password has been updated successfully. You can now log in."),
      });
      form.reset();
      setIsRecoveryContextActive(false); // Prevent further submissions on this page
      setTimeout(() => router.push('/admin/login'), 3000);
    }
    setIsSubmitting(false);
  };

  if (pageIsLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
      <Card className="w-full max-w-sm bg-[#233B6E] border-2 border-accent text-gray-200">
        <CardHeader className="items-center pt-8 pb-4">
          <ProlterLogo fixedColor="hsl(var(--accent))" />
          <CardTitle className="text-xl text-accent pt-4">{t('update_password.title', "Update Password")}</CardTitle>
          <CardDescription className="text-gray-300 text-center px-2">
            {message || t('update_password.description', "Enter your new password below.")}
          </CardDescription>
          <Separator className="my-2 bg-accent" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password" className="text-gray-200">{t('update_password.new_password_label', "New Password")}</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t('update_password.new_password_placeholder', "Enter new password")}
                        className="bg-background/10 text-gray-200 placeholder:text-gray-400 border-primary-foreground/30 focus:border-accent"
                        {...field}
                        disabled={isSubmitting || !!error || !isRecoveryContextActive}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirmPassword" className="text-gray-200">{t('update_password.confirm_password_label', "Confirm New Password")}</Label>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t('update_password.confirm_password_placeholder', "Confirm new password")}
                        className="bg-background/10 text-gray-200 placeholder:text-gray-400 border-primary-foreground/30 focus:border-accent"
                        {...field}
                        disabled={isSubmitting || !!error || !isRecoveryContextActive}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              {/* Message is now part of CardDescription */}
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting || !!error || !isRecoveryContextActive}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? t('update_password.submitting_button', "Updating...") : t('update_password.submit_button', "Update Password")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs pt-4 pb-6">
          <Link href="/admin/login" className="hover:underline text-accent">
            {t('update_password.back_to_login', "Back to Login")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
