// src/app/admin/update-password/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ProlterLogo } from '@/components/prolter-logo';
import { updatePasswordWithToken } from '@/services/postgres/users';

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { toast } = useToast();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsSubmitting(true);
    try {
      await updatePasswordWithToken(token, data.password);
      toast({
        title: t('update_password.success_title', 'Password Updated'),
        description: t('update_password.success_description', 'Your password has been updated successfully. You can now log in.'),
      });
      form.reset();
      setTimeout(() => router.push('/admin/login'), 3000);
    } catch (err: any) {
      toast({
        title: t('update_password.error_title', 'Error'),
        description: err.message || t('update_password.error_description_generic', 'Failed to update password.'),
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm bg-card border text-card-foreground shadow-lg">
        <CardHeader className="items-center pt-8 pb-4">
          <ProlterLogo />
          <CardTitle className="text-xl text-primary pt-4">{t('update_password.title', 'Update Password')}</CardTitle>
          <CardDescription className="text-muted-foreground text-center px-2">
            {t('update_password.description', 'Enter your new password below.')}
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
                    <Label htmlFor="password" className="text-foreground">{t('update_password.new_password_label', 'New Password')}</Label>
                    <FormControl>
                      <Input id="password" type="password" placeholder={t('update_password.new_password_placeholder', 'Enter new password')} {...field} disabled={isSubmitting} />
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
                    <Label htmlFor="confirmPassword" className="text-foreground">{t('update_password.confirm_password_label', 'Confirm New Password')}</Label>
                    <FormControl>
                      <Input id="confirmPassword" type="password" placeholder={t('update_password.confirm_password_placeholder', 'Confirm new password')} {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting
                  ? t('update_password.submitting_button', 'Updating...')
                  : t('update_password.submit_button', 'Update Password')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs pt-4 pb-6">
          <Link href="/admin/login" className="hover:underline text-primary">
            {t('update_password.back_to_login', 'Back to Login')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
