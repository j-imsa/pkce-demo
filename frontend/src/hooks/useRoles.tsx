import {useAuth} from "react-oidc-context";
import {useMemo} from "react";

type JwtLike = {
    realm_access?: { roles?: string[] };
};

function decodeJwt(token?: string | null): JwtLike | null {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * useRoles (realm-only, case-insensitive)
 * - Decodes access_token
 * - Reads roles only from realm_access.roles
 * - Stores roles in lowercase for case-insensitive checks
 * - Exposes helpers: hasRole, isAdmin, isCreator, isBasic
 */
export function useRoles() {
    const auth = useAuth();

    const roles = useMemo<Set<string>>(() => {
        const payload = decodeJwt(auth.user?.access_token);
        const raw = payload?.realm_access?.roles ?? [];
        // normalize to lowercase for case-insensitive matching
        return new Set(raw.map((r) => r.toLowerCase()));
    }, [auth.user?.access_token]);

    const hasRole = (role: string) => roles.has(role.toLowerCase());

    return {
        roles,
        hasRole,
        isAdmin: hasRole("Admin"),
        isCreator: hasRole("Creator"),
        isBasic: hasRole("Basic"),
    };
}