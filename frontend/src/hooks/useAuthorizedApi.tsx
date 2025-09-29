import { useAuth } from "react-oidc-context";
import {api} from "../api/Api.tsx";

export function useAuthorizedApi() {
    const auth = useAuth();

    api.interceptors.request.use((config) => {
        if (auth.user?.access_token) {
            config.headers.Authorization = `Bearer ${auth.user.access_token}`;
        }
        return config;
    });

    return api;
}
