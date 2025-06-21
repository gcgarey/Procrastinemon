'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProcrastinemonLogo from '@/components/icons/ProcrastinemonLogo';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { user, login, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
      return (
          <div className="flex justify-center items-center h-screen bg-background">
              <p className="text-foreground">Loading...</p>
          </div>
      )
  }

  return (
    <Card className="w-full max-w-sm mx-auto border-2 border-foreground shadow-lg pixel-corners bg-card">
      <CardHeader className="text-center">
        <ProcrastinemonLogo className="w-20 h-20 mx-auto mb-4" />
        <CardTitle className="text-2xl">Procrastinemon Trainer</CardTitle>
        <CardDescription>Sign in to start your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={login} className="w-full font-body text-base" disabled={loading}>
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
