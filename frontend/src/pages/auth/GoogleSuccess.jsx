import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/", { replace: true });
      return;
    }

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      toast.success("Signed in with Google successfully!");
      window.location.href = "/dashboard";
    } else {
      toast.error("Authentication failed. No token received.");
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-slate-400">Completing sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleSuccess;
