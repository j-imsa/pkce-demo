import {LogoutPage} from "../pages/LogoutPage.tsx";
import {DashboardPage} from "../pages/DashboardPage.tsx";
import {HomePage} from "../pages/HomePage.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";

export const AppRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage/>}/>
                <Route path="home" element={<HomePage/>}/>
                <Route path="dashboard" element={<DashboardPage/>}/>
                <Route path="logout" element={<LogoutPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}