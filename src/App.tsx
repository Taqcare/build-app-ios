import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import EducationalHub from "./pages/EducationalHub";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Schedule from "./pages/Schedule";
import StorePage from "./pages/Store";
import ResetPassword from "./pages/ResetPassword";
import BottomNav from "./components/Navigation/BottomNav";
import NotFound from "./pages/NotFound";
import IntroSplash from "./components/IntroSplash";
import SkinInfo from "./pages/SkinInfo";

const queryClient = new QueryClient();

// Route guard component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage(); // This will now work because it's inside LanguageProvider
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    if (user) {
      // Check if the user has completed onboarding
      const onboardingStatus = localStorage.getItem(`onboarding_completed_${user.id}`);
      
      // If the user has the is_new_user flag in their metadata, they should see onboarding
      const isNewUser = user.user_metadata?.is_new_user === true;
      console.log("User metadata:", user.user_metadata);
      console.log("Is new user from metadata:", isNewUser);
      console.log("Onboarding status from localStorage:", onboardingStatus);
      
      // Only consider onboarding completed if explicitly set to 'true' in localStorage
      setHasCompletedOnboarding(onboardingStatus === 'true');
    }
  }, [user]);
  
  if (showSplash) {
    return <IntroSplash onComplete={() => setShowSplash(false)} />;
  }
  
  if (isLoading || (user && hasCompletedOnboarding === null)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Onboarding /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Navigate to="/onboarding" /> : <Index />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/education" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Navigate to="/onboarding" /> : <EducationalHub />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Navigate to="/onboarding" /> : <Profile />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Navigate to="/onboarding" /> : <EditProfile />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/skin-info" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Navigate to="/onboarding" /> : <SkinInfo />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Navigate to="/onboarding" /> : <Schedule />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/store" 
          element={
            <ProtectedRoute>
              {(user && hasCompletedOnboarding === false) ? <Navigate to="/onboarding" /> : <StorePage />}
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Show bottom navigation only if authenticated and completed onboarding */}
      {user && hasCompletedOnboarding && <BottomNav />}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <AnimatePresence>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </AnimatePresence>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
