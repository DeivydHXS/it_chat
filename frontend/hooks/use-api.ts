import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import api from "../services/api";

export interface ApiResponse<T> extends AxiosResponse {
    data: T;
}

export const useApi = () => {
    const apiRequest: AxiosInstance = api;

    const transformError = (err: AxiosError) => {
        return err.response
    }

    const get = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
        const result = await apiRequest.get(url, { params })
            .then((res) => { return res })
            .catch((err) => {
                return transformError(err)
            }) as ApiResponse<T>;
        return result;
    };

    const post = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
        console.log('url')
        console.log(url)
        return await apiRequest.post(url, data)
            .then((res) => { return res })
            .catch((err) => {
                return transformError(err)
            }) as ApiResponse<T>;
    };

    const put = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
        return await apiRequest.put(url, data)
            .then((res) => { return res.data })
            .catch((err) => {
                return transformError(err)
            }) as ApiResponse<T>;
    };

    const del = async <T>(url: string): Promise<ApiResponse<T>> => {
        return await apiRequest.delete(url)
            .then((res) => { return res })
            .catch((err) => {
                return transformError(err)
            }) as ApiResponse<T>;
    };

    return { get, post, put, del };
}