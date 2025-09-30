
import { useAuth } from "react-oidc-context";
import { api } from "../api/Api.tsx";
import { useEffect } from "react";

export function useAuthorizedApi() {
    const auth = useAuth();

    useEffect(() => {
        // Request interceptor - add token to requests
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                // Check if token is about to expire (within 60 seconds)
                const isExpired = auth.user && auth.user.expires_at
                    ? auth.user.expires_at < (Date.now() / 1000) + 60
                    : false;

                if (isExpired && !auth.isLoading) {
                    // Try to refresh the token
                    try {
                        await auth.signinSilent();
                    } catch (error) {
                        console.error('Failed to refresh token:', error);
                        // Token refresh failed, redirect to login
                        await auth.signinRedirect();
                        return Promise.reject(error);
                    }
                }

                // Add the token to the request
                if (auth.user?.access_token) {
                    config.headers.Authorization = `Bearer ${auth.user.access_token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - handle 401 errors
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    try {
                        await auth.signinSilent();
                        // Retry the original request with new token
                        const config = error.config;
                        config.headers.Authorization = `Bearer ${auth.user?.access_token}`;
                        return api.request(config);
                    } catch (refreshError) {
                        // Refresh failed, redirect to login
                        await auth.signinRedirect();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [auth]);

    return api;
}