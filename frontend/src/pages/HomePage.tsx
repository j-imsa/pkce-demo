import {useAuth} from "react-oidc-context";

export const HomePage = () => {

    const auth = useAuth();

    if (auth.isLoading) return <div>Loading auth...</div>;
    if (!auth.isAuthenticated) {
        return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
    }

    return (
        <>
            <h1>Home Page</h1>
            {auth.isLoading && (
                <div>Loading auth...</div>
            )}
            {!auth.isAuthenticated ? (
                <button onClick={() => void auth.signinRedirect()}>Log in</button>
            ) : (
                <div>You're logged in</div>
            )}

        </>
    )
}