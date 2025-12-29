import {AppRouter} from "./routing/AppRouter.tsx";
import {AuthProvider} from "react-oidc-context";
import {WebStorageStateStore} from "oidc-client-ts";
import './index.css'

const oidcConfig = {
    authority: "http://localhost:8080/realms/pkce-demo",
    client_id: "my-react-app",
    redirect_uri: globalThis.location.origin + "/dashboard",
    silent_redirect_uri: globalThis.location.origin + "/silent-renew.html",
    post_logout_redirect_uri: globalThis.location.origin + "/logout",
    response_type: "code",
    code_challenge_method: "S256",
    scope: "openid profile email offline_access",
    automaticSilentRenew: true,
    loadUserInfo: true,
    accessTokenExpiringNotificationTimeInSeconds: 5,
    monitorSession: true,
    userStore: new WebStorageStateStore({ store: globalThis.sessionStorage }),
};

export default function AppEntrypoint() {
    return (
        <AuthProvider {...oidcConfig}>
            <AppRouter />
        </AuthProvider>
    );
}
