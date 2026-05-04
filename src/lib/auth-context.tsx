'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';

interface AuthContextType {
  user: any;
  isGuest: boolean;
  isLoading: boolean;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: false,
  isLoading: true,
  loginAsGuest: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children?: any }) => {
  const [user, setUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          setIsGuest(false);
        } else {
          const guestData = localStorage.getItem('neuro_nest_guest');
          if (guestData) {
            setUser(JSON.parse(guestData));
            setIsGuest(true);
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Race the session check with a timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    checkSession().then(() => clearTimeout(timeout));
  }, []);

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest-' + Math.random().toString(36).substr(2, 9),
      email: 'guest@neuro-nest.demo',
      is_guest: true,
    };
    localStorage.setItem('neuro_nest_guest', JSON.stringify(guestUser));
    setUser(guestUser);
    setIsGuest(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('neuro_nest_guest');
    setUser(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
