import type {PropsWithChildren} from "react";
import {useAuth} from "react-oidc-context";
import {useEffect} from "react";

export const ProtectedRoute = ({children}: PropsWithChildren) => {
    const auth = useAuth();

    useEffect(() => {
        // Only redirect if not loading and not authenticated
        if (!auth.isLoading && !auth.isAuthenticated) {
            auth.signinRedirect({state: {returnTo: window.location.pathname}});
        }
    }, [auth.isLoading, auth.isAuthenticated]);

    if (auth.isLoading) return <div className="min-h-dvh flex items-center justify-center bg-white text-black">
        <span className="text-sm">Loading...</span>
    </div>;

    if (!auth.isAuthenticated) return <div className="min-h-dvh flex items-center justify-center bg-white text-black">
        <span className="text-sm">Redirecting to login...</span>
    </div>;

    return children;
};