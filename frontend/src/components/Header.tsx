import {Link} from "react-router-dom";
import {useAuth} from "react-oidc-context";

export const Header = () => {
    const auth = useAuth();

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
                            <Link
                                to="/dashboard"
                                className="h-9 px-4 inline-flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
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