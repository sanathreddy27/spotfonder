import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-blue-400"
        >
          SpotFonder
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/destination"
            className="hover:text-blue-400 transition"
          >
            Explore
          </Link>

          <Link
            to="/saved-trips"
            className="hover:text-blue-400 transition"
          >
            My Trips
          </Link>

          <Link
            to="/budget"
            className="hover:text-blue-400 transition"
          >
            Budget Planner
          </Link>

          <Link
            to="/profile"
            className="hover:text-blue-400 transition"
          >
            Profile
          </Link>

          {/* Authentication Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-cyan-400 font-semibold">
                👤 {user.name}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white transition"
              >
                Register
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;