import {Link} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import {useEffect} from "react";

export const Header = () => {
    const auth = useAuth();

    useEffect(() => {
        // Event: Access token expiring (triggered based on accessTokenExpiringNotificationTimeInSeconds)
        const removeExpiringListener = auth.events.addAccessTokenExpiring(() => {
            console.log("⚠️ Access token is expiring soon! Attempting silent renew...");
        });

        // Event: User loaded (triggered when a new token is received, e.g., after refresh)
        const removeLoadedListener = auth.events.addUserLoaded((user) => {
            console.log("✅ User loaded. Token refreshed successfully!", user);
        });

        // Event: Silent renew error
        const removeErrorListener = auth.events.addSilentRenewError((error) => {
            console.error("❌ Silent renew failed:", error);
        });

        return () => {
            removeExpiringListener();
            removeLoadedListener();
            removeErrorListener();
        };
    }, [auth.events]);

    return (
        <header className="w-full border-b border-black">
            <div className="mx-auto w-full max-w-5xl px-4 py-4 flex items-center justify-between">
                <Link to="/" className="font-semibold tracking-tight uppercase">
                    PKCE-DEMO
                </Link>
                <nav className="flex items-center gap-4">
                    {!auth.isAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => void auth.signinRedirect()}
                            className="h-9 px-4 bg-black text-white border border-black hover:opacity-90 transition-opacity"
                        >
                            Log in
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => void auth.signoutRedirect()}
                                className="h-9 px-4 bg-black text-white border border-black hover:opacity-90 transition-opacity"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}