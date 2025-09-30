
import {useAuth} from "react-oidc-context";
import { useState} from "react";
import {useRoles} from "../hooks/useRoles.tsx";
import {useAuthorizedApi} from "../hooks/useAuthorizedApi.tsx";
import {UserManagement} from "../components/UserManagement.tsx";

export const DashboardPage = () => {
    const auth = useAuth();
    const {roles, isAdmin, isCreator, isBasic, hasRole} = useRoles();
    const [list, setList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const api = useAuthorizedApi();

    const fillList = async () => {
        try {
            setLoading(true);
            const res = await api.get<string[]>("/list");
            setList(res.data);
        } catch (err) {
            console.error("API call failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-white text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-10">
                <header className="mb-8 border-b border-black pb-4">
                    <h1 className="text-2xl font-semibold">Dashboard (Protected)</h1>
                    <p className="mt-2 text-sm">
                        Welcome {auth.user?.profile?.given_name ?? auth.user?.profile?.preferred_username}
                    </p>
                </header>

                <section className="grid gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => void auth.removeUser()}
                            className="h-9 px-4 bg-black text-white border border-black hover:opacity-90 transition-opacity"
                            type="button"
                        >
                            Log out (local)
                        </button>
                        <button
                            onClick={() => void auth.signoutRedirect()}
                            className="h-9 px-4 bg-black text-white border border-black hover:opacity-90 transition-opacity"
                            type="button"
                        >
                            Log out (global)
                        </button>
                        <button
                            onClick={fillList}
                            className="h-9 px-4 border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-60"
                            type="button"
                            disabled={loading}
                        >
                            {loading ? "Loading…" : "Call API"}
                        </button>
                    </div>

                    <div className="border border-black p-4">
                        <h2 className="font-medium mb-3">Realm roles</h2>
                        {roles.size === 0 ? (
                            <p className="text-sm">No realm roles</p>
                        ) : (
                            <ul className="grid gap-1">
                                {Array.from(roles)
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((r) => (
                                        <li key={r} className="py-1 border-b border-black/30 last:border-b-0">
                                            {r}
                                        </li>
                                    ))}
                            </ul>
                        )}
                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            <div className="border border-black p-2 text-sm">
                                isAdmin: <span className="font-medium">{String(isAdmin)}</span>
                            </div>
                            <div className="border border-black p-2 text-sm">
                                isCreator: <span className="font-medium">{String(isCreator)}</span>
                            </div>
                            <div className="border border-black p-2 text-sm">
                                isBasic: <span className="font-medium">{String(isBasic)}</span>
                            </div>
                            <div className="border border-black p-2 text-sm sm:col-span-3">
                                hasRole("Admin"): <span className="font-medium">{String(hasRole("Admin"))}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-black p-4">
                        {list.length === 0 && !loading ? (
                            <p className="text-sm text-black">No items yet. Call the API to load data.</p>
                        ) : (
                            <ul className="grid gap-2">
                                {list.map((item) => (
                                    <li key={item} className="border-b border-black/30 last:border-b-0 py-1">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* User Management Section */}
                    {isAdmin && <UserManagement />}
                </section>
            </div>
        </div>
    );
};