
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-gradient font-['Space_Grotesk'] mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
            <p className="text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 glass rounded-lg font-semibold text-gray-300 hover:text-white transition-all duration-300 border border-white/10 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
