import SignIn from "./pages/auth/sign-in.jsx";
import SignUp from "./pages/auth/sign-up.jsx";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import AccountPage from "./pages/account-page";
import Transactions from "./pages/transactions";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import useStore from "./store/index.js";
import { setAuthToken } from "./libs/apiCalls.js";
import { Toaster } from "sonner";
import Navbar from "./components/navbar.jsx";

const RootLayout = () => {
    const {user} = useStore((state) => state);
    setAuthToken(user?.token || "")
    
    return !user ? (
        <Navigate to="/sign-in" replace={true} />
    ) : (
        <>
            {/* Navbar with full width - no padding */}
            <div className="w-full">
                <Navbar />
            </div>
            {/* Content area with padding */}
            <div className="min-h-[calc(100vh-100px)] px-6 md:px-20 bg-gray-100">
                <Outlet/>
            </div>
        </>
    );
};

function App() {
    const { theme } = useStore((state) => state);

    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [theme]);

    return (
        <main>
            <div className="w-full min-h-screen">
                <Routes>
                    <Route element={<RootLayout />}>
                        <Route path="/" element={<Navigate to="/overview" />} />
                        <Route path="/overview" element={<Dashboard />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/account" element={<AccountPage />} />
                    </Route>
                    {/* Auth pages with padding */}
                    <Route path="/sign-in" element={
                        <div className="px-6 md:px-20 bg-gray-100 min-h-screen">
                            <SignIn />
                        </div>
                    } />
                    <Route path="/sign-up" element={
                        <div className="px-6 md:px-20 bg-gray-100 min-h-screen">
                            <SignUp />
                        </div>
                    } />
                </Routes>
            </div>
            <Toaster richColors position="top-center"/>
        </main>
    );
}

export default App;