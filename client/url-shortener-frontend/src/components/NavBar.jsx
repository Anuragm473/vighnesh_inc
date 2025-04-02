import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/authSlice"; // Update this path to match your file structure

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.token);
  
  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-600" : "";
  };
  
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
      <div 
        className="text-xl font-bold flex items-center cursor-pointer transition duration-300 hover:text-blue-400" 
        onClick={() => navigate("/")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span>URL Shortener</span>
      </div>
      
      <div className="flex items-center">
        {!isAuthenticated ? (
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate("/login")} 
              className={`px-4 py-2 rounded-md transition duration-300 hover:bg-blue-500 ${isActive("/login")}`}
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/register")} 
              className={`px-4 py-2 rounded-md transition duration-300 hover:bg-blue-500 ${isActive("/register")}`}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate("/dashboard")} 
              className={`px-4 py-2 rounded-md transition duration-300 hover:bg-blue-500 ${isActive("/dashboard")}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
            <button 
              onClick={() => navigate("/home")} 
              className={`px-4 py-2 rounded-md transition duration-300 hover:bg-blue-500 ${isActive("/home")}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Shortener
            </button>
            <button 
              onClick={() => dispatch(logout())} 
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};