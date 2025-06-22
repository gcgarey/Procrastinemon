'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProcrastinemonLogo from '@/components/icons/ProcrastinemonLogo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Login() {
  const { user, login, register, loading } = useAuth();
  const router = useRouter();
  const [isRegisterView, setIsRegisterView] = useState(false);
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isRegisterView) {
        await register(data.email, data.password);
      } else {
        await login(data.email, data.password);
      }
      router.push('/');
    } catch (error: any) {
      const message = error.message || 'An unexpected error occurred.';
      toast({
        title: 'Authentication Failed',
        description: message,
        variant: 'destructive',
      });
    }
  };

  if (loading || user) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto border-2 border-foreground shadow-lg pixel-corners bg-card">
      <CardHeader className="text-center">
        <ProcrastinemonLogo className="w-20 h-20 mx-auto mb-4" />
        <CardTitle className="text-2xl">{isRegisterView ? 'Create Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>{isRegisterView ? 'Join the trainers!' : 'Sign in to continue'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="trainer@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-body text-base" disabled={loading}>
              {isRegisterView ? 'Register' : 'Login'}
            </Button>
          </form>
        </Form>
        <Button variant="link" onClick={() => setIsRegisterView(!isRegisterView)} className="w-full mt-4 text-xs whitespace-normal h-auto">
          {isRegisterView ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Button>
      </CardContent>
    </Card>
  );
}
