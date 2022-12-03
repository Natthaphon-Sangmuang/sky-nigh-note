import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  function copyText() {
    navigator.clipboard.writeText(user.userid);
  }
  return (
    <header>
      <div className="nav">
        <div className="container">
          <h1 className="night-sky-notes">
            Night Sky Notes <div className="underline"></div>
          </h1>
          <nav>
            {user && (
              <div>
                <div className="nav-email">{user.email}</div>
                <div className="nav-id">my id: {user.userid}</div>
                <button
                  onClick={copyText}
                  className="material-symbols-outlined nav-copy"
                >
                  Content_Copy
                </button>
                <button onClick={handleClick} className="nav-log-out">
                  Logout
                </button>
              </div>
            )}
            {!user && (
              <div>
                <Link to="/login" className="log-sign">
                  Login
                </Link>
                <Link to="/signup" className="log-sign">
                  Signup
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
