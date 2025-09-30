import {useAuth} from "react-oidc-context";
import {api} from "../api/Api.tsx";
import {useEffect, useRef, useCallback} from "react";
import type {AxiosInstance, AxiosHeaders} from "axios";

type AxiosRequestConfigWithRetry = import("axios").InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export function useAuthorizedApi(): AxiosInstance {
    const auth = useAuth();
    const refreshPromiseRef = useRef<Promise<void> | null>(null);
    const interceptorsSetRef = useRef(false);

    // Memoize the token refresh logic
    const refreshTokenIfNeeded = useCallback(async (): Promise<void> => {
        if (!auth.user || auth.isLoading) {
            return;
        }

        // Check if token expires within 60 seconds
        const expiresAt = auth.user.expires_at;
        if (!expiresAt || expiresAt > Math.floor(Date.now() / 1000) + 60) {
            return; // Token is still valid
        }

        // Prevent concurrent refresh attempts
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        refreshPromiseRef.current = auth.signinSilent()
            .catch((error) => {
                console.error('Silent token refresh failed:', error);
                throw error;
            })
            .finally(() => {
                refreshPromiseRef.current = null;
            });

        return refreshPromiseRef.current;
    }, [auth.user?.expires_at, auth.signinSilent, auth.isLoading, auth.user]);

    useEffect(() => {
        // Only set up interceptors once
        if (interceptorsSetRef.current) {
            return;
        }

        interceptorsSetRef.current = true;

        // Request interceptor
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                try {
                    // Try to refresh token if needed
                    if (!auth.isLoading) {
                        await refreshTokenIfNeeded();
                    }
                } catch (error) {
                    console.warn('Token refresh in request interceptor failed:', error);
                    // Continue with existing token if refresh fails
                }

                // Ensure headers object exists and is properly typed
                if (!config.headers) {
                    config.headers = new AxiosHeaders();
                }

                // Add authorization header if we have a token
                const token = auth.user?.access_token;
                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest: AxiosRequestConfigWithRetry = error.config;

                if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // Try to refresh the token
                        await refreshTokenIfNeeded();

                        // Ensure headers object exists and is properly typed
                        if (!originalRequest.headers) {
                            originalRequest.headers = new AxiosHeaders();
                        }

                        // Update request with new token
                        const newToken = auth.user?.access_token;
                        if (newToken) {
                            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
                            // Retry the original request
                            return api.request(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed on 401 response:', refreshError);

                        // If refresh fails, redirect to login
                        try {
                            await auth.signinRedirect();
                        } catch (redirectError) {
                            console.error('Redirect to login failed:', redirectError);
                        }

                        // Use Error object instead of literal
                        const authError = new Error('Authentication failed');
                        authError.cause = refreshError;
                        return Promise.reject(authError);
                    }
                }

                return Promise.reject(error);
            }
        );

        // Cleanup function
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
            interceptorsSetRef.current = false;
        };
    }, [auth.signinRedirect, refreshTokenIfNeeded, auth.user?.access_token]);

    return api;
}