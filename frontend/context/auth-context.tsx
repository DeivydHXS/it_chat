import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import type { TokenInterface, UserInterface } from '../interfaces/user-interfaces';
import { LOCAL_STORAGE_KEYS } from '../constants/localstorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  user: UserInterface | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>;
  logout: () => Promise<void>;
  doLogin: (userData: UserInterface, token: TokenInterface) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInterface | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const storagedUser = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.USER);
        const storagedToken = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        if (storagedToken && storagedUser) {
          setUser(JSON.parse(storagedUser));
        }
      } catch (err) {
        console.error('Erro ao carregar dados do AsyncStorage', err);
      }
    })();
  }, []);

  async function doLogin(userData: UserInterface, token: TokenInterface) {
    try {
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, JSON.stringify(token));
      setUser(userData);
    } catch (err) {
      console.error('Erro ao salvar dados no AsyncStorage', err);
    }
  }

  async function logout() {
    try {
      setUser(undefined);
      await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    } catch (err) {
      console.error('Erro ao remover dados do AsyncStorage', err);
    }
  }

  return (
    <AuthContext.Provider value={{ setUser, user, logout, doLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
