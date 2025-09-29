import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const LogoutPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/");
    }, [navigate]);
    return (
        <div className="min-h-dvh flex items-center justify-center bg-white text-black">
            <p className="text-sm">Logging out…</p>
        </div>
    );
}
