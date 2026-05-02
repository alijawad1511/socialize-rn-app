import { supabase } from "@/lib/supabase/client";
import { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  usernname: string;
  name: string;
  email: string;
  profileImage?: string;
  onBoradingCompleted?: boolean;
}

interface AuthContext {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signUp = async (email: string, password: string) => {
    const { data, error} = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      console.log('User:', data);
    }
  }


  return <AuthContext.Provider value={{ user, signUp }}>{ children }</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}