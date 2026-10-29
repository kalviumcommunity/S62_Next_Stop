import { Link, useNavigate } from "react-router-dom";

export const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export default function NavBar({ children }) {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-amber-400 hover:text-amber-300">
          Next Stop
        </Link>
        <div className="flex items-center gap-2">
          {children}
          {loggedIn ? (
            <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white">
              Log out
            </button>
          ) : (
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
