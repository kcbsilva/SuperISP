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
import { Separator } from '@/components/ui/separator';
import { ProlterLogo } from '@/components/prolter-logo'; // Import the new ProlterLogo component

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
  const [pageIsLoading, setPageIsLoading] = React.useState(true);
  const [isRecoveryContextActive, setIsRecoveryContextActive] = React.useState(false);

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (pageIsLoading) {
        setPageIsLoading(false);
      }

      if (event === 'PASSWORD_RECOVERY') {
        setMessage(t('update_password.ready_to_update'));
        setError('');
        setIsRecoveryContextActive(true);
      } else if (session && event === 'SIGNED_IN' && !isRecoveryContextActive) {
        setError(t('update_password.error_already_logged_in', "You are already logged in. Password reset is for logged-out users."));
        setIsRecoveryContextActive(false);
      } else if (!session && event !== 'INITIAL_SESSION' && !isRecoveryContextActive) {
        // If no session and it's not the initial check, and not already in recovery, it's likely an invalid token.
        // This condition might need adjustment if the token is valid but there's no "active" session yet.
        // Supabase client handles token from URL hash, `PASSWORD_RECOVERY` event is the confirmation.
      }
    });
    
    // Check if Supabase client picks up a recovery token from URL hash.
    // This might trigger onAuthStateChange with PASSWORD_RECOVERY shortly after page load.
    supabase.auth.getSession().then(({ data }) => {
        if (pageIsLoading) {
            setPageIsLoading(false);
        }
        if (!data.session && !isRecoveryContextActive) { // Added !isRecoveryContextActive
          // If getSession returns no session AND we haven't hit PASSWORD_RECOVERY yet,
          // it's possible the token is invalid or already used, or not present.
          // We wait for onAuthStateChange to confirm PASSWORD_RECOVERY.
          // If it doesn't come, we might show an error.
          // A timeout could be used here to show "invalid token" if PASSWORD_RECOVERY doesn't fire.
        }
    });


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [t, pageIsLoading, isRecoveryContextActive]); // isRecoveryContextActive added


  const onSubmit = async (data: UpdatePasswordFormData) => {
    if (!isRecoveryContextActive) {
      setError(t('update_password.error_invalid_token', "Cannot update password. Recovery session not active or token invalid."));
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
      setIsRecoveryContextActive(false); // Reset context after successful update
      setTimeout(() => router.push('/admin/login'), 3000);
    }
    setIsSubmitting(false);
  };

  if (pageIsLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm bg-card border text-card-foreground shadow-lg">
        <CardHeader className="items-center pt-8 pb-4">
          <ProlterLogo /> {/* Using the imported component */}
          <CardTitle className="text-xl text-primary pt-4">{t('update_password.title', "Update Password")}</CardTitle>
          <CardDescription className="text-muted-foreground text-center px-2">
            {message || (isRecoveryContextActive ? t('update_password.description', "Enter your new password below.") : t('update_password.error_invalid_token', "Invalid or expired password reset link. Please request a new one."))}
          </CardDescription>
          <Separator className="my-2 bg-border" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password" className="text-foreground">{t('update_password.new_password_label', "New Password")}</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t('update_password.new_password_placeholder', "Enter new password")}
                        {...field}
                        disabled={isSubmitting || !!error || !isRecoveryContextActive}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirmPassword" className="text-foreground">{t('update_password.confirm_password_label', "Confirm New Password")}</Label>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t('update_password.confirm_password_placeholder', "Confirm new password")}
                        {...field}
                        disabled={isSubmitting || !!error || !isRecoveryContextActive}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting || !!error || !isRecoveryContextActive}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? t('update_password.submitting_button', "Updating...") : t('update_password.submit_button', "Update Password")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs pt-4 pb-6">
          <Link href="/admin/login" className="hover:underline text-primary">
            {t('update_password.back_to_login', "Back to Login")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
