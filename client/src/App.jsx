import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthstore.js';
import { useThemeStore } from './store/useThemeStore.js';
 
function App() {
   const {authUser, CheckAuth, isCheckingAuth,onlineUsers} = useAuthStore();
   const { theme } = useThemeStore();
 
   console.log({onlineUsers});

   useEffect(() => {
       CheckAuth();
   }, [CheckAuth  ]);

   console.log("Auth User:", authUser);

   if (isCheckingAuth) {
       return (
           <div className="flex items-center justify-center h-screen">
               <Loader className="animate-spin h-10 w-10 text-blue-500" />
           </div>
       );
   }

  return (
    <>
    <div className={`min-h-screen bg-base-100`} data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes> 
    </div>
    </>
  );
}

export default App;
