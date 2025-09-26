import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const LogoutPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/");
    }, []);
    return <p>Logging out...</p>;
}
