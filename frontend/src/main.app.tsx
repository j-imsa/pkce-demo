import {AppRouter} from "./routing/AppRouter.tsx";
import {AuthProvider} from "react-oidc-context";
import './index.css'

const oidcConfig = {
    authority: "http://localhost:8080/realms/pkce-demo",
    client_id: "my-react-app",
    redirect_uri: window.location.origin + "/dashboard",
    post_logout_redirect_uri: window.location.origin + "/logout",
    response_type: "code",
    code_challenge_method: "S256",
    scope: "openid profile email offline_access",
    automaticSilentRenew: true,
};

export default function AppEntrypoint() {
    return (
        <AuthProvider {...oidcConfig}>
            <AppRouter />
        </AuthProvider>
    );
}
