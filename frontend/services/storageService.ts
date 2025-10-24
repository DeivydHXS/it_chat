import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_STORAGE_KEYS } from '../constants/localstorage';
import type { TokenInterface } from '../interfaces/user-interfaces';

export const StorageService = {
    async saveToken(token: TokenInterface) {
        try {
            await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, JSON.stringify(token));
        } catch (err) {
            console.error('Erro ao salvar token no AsyncStorage:', err);
        }
    },

    async getToken(): Promise<TokenInterface | null> {
        try {
            const tokenStr = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
            return tokenStr ? JSON.parse(tokenStr) : null;
        } catch (err) {
            console.error('Erro ao recuperar token do AsyncStorage:', err);
            return null;
        }
    },

    async removeToken() {
        try {
            await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        } catch (err) {
            console.error('Erro ao remover token do AsyncStorage:', err);
        }
    },

    async setFirst(bool: boolean) {
        try {
            await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.FIRST, JSON.stringify(bool));
        } catch (err) {
            console.error('Erro ao salvar first no AsyncStorage:', err);
        }
    },

    async getFirst() {
        try {
            const first = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.FIRST);
            return Boolean(first)
        } catch (err) {
            console.error('Erro ao recuperar first do AsyncStorage:', err);
        }
    }
};
