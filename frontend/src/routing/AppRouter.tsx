import {LogoutPage} from "../pages/LogoutPage.tsx";
import {DashboardPage} from "../pages/DashboardPage.tsx";
import {HomePage} from "../pages/HomePage.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useSingleTabEnforcer} from "../hooks/useSingleTabEnforcer.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";

export const AppRouter = () => {
    const {isLeader, otherOpen} = useSingleTabEnforcer({channelName: "pkce-demo-tab"});

    return (
        <>
            {otherOpen && !isLeader ? (
                <div style={{display: 'grid', placeItems: 'center', minHeight: '100vh', fontFamily: 'system-ui'}}>
                    <div>
                        <h1>Another tab is active</h1>
                        {otherOpen ? <p>Please use the other open tab.</p> : <p>Checking for active tab…</p>}
                    </div>
                </div>
            ) : (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <DashboardPage/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/logout" element={<LogoutPage/>}/>
                    </Routes>
                </BrowserRouter>
            )}
        </>
    )
}