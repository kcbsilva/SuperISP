// src/app/admin/forgot-password/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendPasswordResetEmail } from '@/services/postgres/users';
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

    try {
      await sendPasswordResetEmail(data.email);
    } else {
      setMessage(t('forgot_password.success_description', "If an account exists for this email, a password reset link has been sent."));
      toast({
        title: t('forgot_password.success_title', "Check Your Email"),
        description: t('forgot_password.success_description', "If an account exists for this email, a password reset link has been sent."),
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: t('forgot_password.error_title', "Error"),
        description: error.message || t('forgot_password.error_description', "Failed to send password reset email."),
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm bg-card border text-card-foreground shadow-lg">
        <CardHeader className="items-center pt-8 pb-4">
          <ProlterLogo /> {/* Using the imported component */}
          <CardTitle className="text-xl text-primary pt-4">{t('forgot_password.title', "Forgot Password?")}</CardTitle>
          <CardDescription className="text-muted-foreground text-center px-2">
            {t('forgot_password.description', "Enter your email address and we'll send you a link to reset your password.")}
          </CardDescription>
          <Separator className="my-2 bg-border" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="text-foreground">{t('forgot_password.email_label', "Email Address")}</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('forgot_password.email_placeholder', "you@example.com")}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              {message && <p className="text-xs text-green-600">{message}</p>}
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? t('forgot_password.submitting_button', "Sending...") : t('forgot_password.submit_button', "Send Reset Link")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs pt-4 pb-6">
          <Link href="/admin/login" className="hover:underline text-primary">
            {t('forgot_password.back_to_login', "Back to Login")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
