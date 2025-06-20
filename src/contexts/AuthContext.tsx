
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Only set loading to false when auth state is determined for the first time.
      if (isLoading) setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['admin-status', user?.id],
    queryFn: async () => {
        if (!user) return false;
        const { data, error } = await supabase.rpc('is_admin');
        if (error) {
            console.error('Error checking admin status:', error.message);
            toast.error("Could not verify admin status.");
            return false;
        }
        return data as boolean;
    },
    enabled: !!user && !isLoading,
    initialData: false,
  });

  const value = {
    session,
    user,
    isLoading,
    isAdmin: isAdmin ?? false,
    isAdminLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
