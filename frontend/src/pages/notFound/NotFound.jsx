import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { isAuthenticated, homePath } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md text-center">
        <div className="text-8xl font-bold text-indigo-500 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-slate-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(isAuthenticated ? homePath : "/")}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
