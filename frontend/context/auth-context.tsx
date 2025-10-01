import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import type { TokenInterface, UserInterface } from '../interfaces/user-interfaces';
import { LOCAL_STORAGE_KEYS } from '../constants/localstorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  user: UserInterface | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>;
  logout: () => Promise<void>;
  login: (userData: UserInterface, token: TokenInterface) => Promise<void>;
  getUser: () => Promise<UserInterface | undefined>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInterface | undefined>(undefined);

  useEffect(() => {
    getUser();
  }, []);

  async function login(userData: UserInterface, token: TokenInterface) {
    try {
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData) || '');
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, JSON.stringify(token) || '');
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.FIRST, 'true');
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

  async function getUser(): Promise<UserInterface | undefined> {
    try {
      const storagedUser = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (storagedUser) {
        const parsedUser: UserInterface = JSON.parse(storagedUser);
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (err) {
      console.error('Erro ao carregar usuário do AsyncStorage', err);
    }
    return undefined;
  }

  return (
    <AuthContext.Provider value={{ setUser, user, logout, login, getUser }}>
      {children}
    </AuthContext.Provider>
  );

};
