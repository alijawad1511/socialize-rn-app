import { supabase } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  profileImage?: string;
  onBoardingCompleted?: boolean;
}

interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkSession();
   }, []);

   const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        console.log('No session found');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
    }
  }
  
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data) {
        console.error('User profile not found');
        return null;
      }

      const authUser = await supabase.auth.getUser();
      if (!authUser.data.user) {
        console.error('Authenticated user not found');
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        username: data.username,
        email: authUser.data.user.email || '',
        profileImage: data.profile_image,
        onBoardingCompleted: data.on_boarding_completed,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        console.log("User Profile:", userProfile);
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      }); 

      if (error) throw error;

      if (data.user) {
        console.log("User:", data);
        const userProfile = await fetchUserProfile(data.user.id);
        console.log("User Profile:", userProfile);
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const updatedData: any = {};
      if(userData.name !== undefined) updatedData.name = userData.name;
      if (userData.username !== undefined) updatedData.username = userData.username;
      if (userData.profileImage !== undefined) updatedData.profile_image = userData.profileImage;
      if (userData.onBoardingCompleted !== undefined) updatedData.on_boarding_completed = userData.onBoardingCompleted;

      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

        if(error) throw error;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  return <AuthContext.Provider value={{ user, login, signUp, updateUser }}>{ children }</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}