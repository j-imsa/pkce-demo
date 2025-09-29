import {useAuth} from "react-oidc-context";
import {Link} from "react-router-dom";
import {Header} from "../components/Header.tsx";
import {Footer} from "../components/Footer.tsx";

export const HomePage = () => {
    const auth = useAuth();

    if (auth.isLoading) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-white text-black">
                <span className="text-sm">Loading auth...</span>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-white text-black flex flex-col">
            <Header/>
            <main className="flex-1">
                <section className="mx-auto w-full max-w-5xl px-4 py-16">
                    {!auth.isAuthenticated ? (
                        <div className="grid gap-6">
                            <h1 className="text-2xl font-semibold">Welcome</h1>
                            <p className="max-w-prose">
                                This is a public home page you can see before logging in.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            <div className="text-sm">You're logged in</div>
                            <div>
                                <Link
                                    to="/dashboard"
                                    className="h-10 px-5 inline-flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <Footer/>
        </div>
    );
};