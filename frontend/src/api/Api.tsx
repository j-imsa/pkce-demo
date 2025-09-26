import axios, { AxiosError, type AxiosInstance } from "axios";
import { UserManager, User } from "oidc-client-ts";

let userManager: UserManager | null = null;
let getUser: (() => User | null) | null = null;

export function configureAuth(manager: UserManager, getUserFn: () => User | null) {
    userManager = manager;
    getUser = getUserFn;
}

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
    const user = getUser?.();
    if (user?.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401 && userManager) {
            try {
                const refreshedUser = await userManager.signinSilent();
                if (refreshedUser) {
                    error.config!.headers.Authorization = `Bearer ${refreshedUser.access_token}`;
                    return api.request(error.config!);
                }
            } catch (err) {
                console.error("Silent refresh failed", err);
                await userManager.signoutRedirect();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
