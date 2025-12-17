import {useAuth} from "react-oidc-context";
import {api} from "../api/Api.tsx";
import {useEffect, useRef} from "react";
import {AxiosHeaders} from "axios";

export function useAuthorizedApi() {
    const auth = useAuth();
    const interceptorsSetRef = useRef(false);

    useEffect(() => {
        // Only set up interceptors once
        if (interceptorsSetRef.current) {
            return;
        }

        interceptorsSetRef.current = true;

        // Request interceptor: JUST ATTACH THE TOKEN
        // We rely on 'automaticSilentRenew: true' in oidcConfig to keep the token fresh.
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                // Ensure headers object exists
                if (!config.headers) {
                    config.headers = new AxiosHeaders();
                }

                // Add authorization header if we have a token
                // auth.user.access_token is reactive and managed by the library
                const token = auth.user?.access_token;
                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        // We only handle 401s as a fallback if silent renew totally failed
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                // If we get a 401, it means the token is invalid/expired
                // AND silent renew failed or hasn't happened yet.
                if (error.response?.status === 401) {
                    console.warn("API returned 401. Token might be expired.");
                    // You could try one manual attempt here if you really want,
                    // but usually, if silent renew failed, the user session is likely dead.
                    // A safe bet is to let the user know or redirect to login.
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
    }, [auth.user?.access_token]); // Depend on the token so interceptor sees the new one

    return api;
}