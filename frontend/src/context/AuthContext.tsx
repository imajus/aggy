"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { authenticated, login, logout } = usePrivy();

  return (
    <AuthContext.Provider value={{ isLoggedIn: authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};