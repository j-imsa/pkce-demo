import {useAuth} from "react-oidc-context";
import {useState} from "react";
import api from "../api/Api.tsx";

export const DashboardPage = () => {
    const auth = useAuth();
    const [list, setList] = useState<string[]>([]);

    const fillList = async () => {
        try {
            const res = await api.get<string[]>("/list");
            setList(res.data);
        } catch (err) {
            console.error("API call failed", err);
        }
    }
    return (
        <div>
            <h1>Dashboard (Protected)</h1>
            <p>Welcome {auth.user?.profile?.preferred_username ?? auth.user?.profile?.email}</p>
            <button onClick={() => void auth.removeUser()}>Log out (local)</button>
            <button onClick={() => void auth.signoutRedirect()}>Log out (global)</button>
            <div>
                <button onClick={fillList}>Call API</button>
                <div>
                    {list.map(item => (
                        <p key={item}>{item}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}