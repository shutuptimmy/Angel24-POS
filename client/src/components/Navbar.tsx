import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/angels24-logo.png"
import { useAuth } from "../context/AuthContext";
import { useCallback, useState, type FormEvent } from "react";
import ErrorHandler from "./handler/ErrorHandler";
import SmolSpinner from "./SmolSpinner";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
  
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const menuItems = [
        {
            route: "/inventory",
            title: "Inventory",
        },
        {
            route: "/stocks",
            title: "Stock Monitoring",
        },
        {
            route: "/orders",
            title: "Transactions",
        },
        {
            route: "/statistics",
            title: "Statistics",
        },
        {
            route: "/accounts",
            title: "Accounts",
        },
    ];
    const handleNavCollapse = useCallback(() => {
        setIsNavCollapsed(!isNavCollapsed);
    }, [isNavCollapsed]);

    const handleLogout = (e: FormEvent) => {
        e.preventDefault();
    
        setLoadingLogout(true);
    
        logout()
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            ErrorHandler(error, null);
          })
          .finally(() => {
            setLoadingLogout(false);
          });
      };
    
      const handleUserStatus = () => {
        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
    
        let fullName = "";
    
        if (parsedUser.middle_name) {
          fullName = `${parsedUser.last_name}, ${parsedUser.first_name} ${parsedUser.middle_name[0]}.`;
        } else {
          fullName = `${parsedUser.last_name}, ${parsedUser.first_name}`;
        }
    
        return fullName;
      };

  return (
    <>
        <nav className="navbar navbar-expand-lg bg-primary rounded-bottom mb-3">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img src={Logo} className="rounded-4" width={50} alt="Angels24-logo"/>
                </a>
                <button className="navbar-toggler" type="button" onClick={handleNavCollapse} aria-controls="navbarSupportedContent" aria-expanded={!isNavCollapsed} aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {menuItems.map((menuItem, index) => (
                            <li className="nav-item" key={index}>
                                <Link className={`nav-link fw-medium text-white ${location.pathname === menuItem.route ? 'active' : ''}`} to={menuItem.route} onClick={handleNavCollapse}>
                                    {menuItem.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <b className="pe-4 text-white">You're logged in as, {handleUserStatus()}</b>
                    <button type="submit" className="btn btn-danger" onClick={handleLogout} disabled={loadingLogout}>
                        {loadingLogout ? (
                        <>
                            <SmolSpinner /> Logging Out...
                        </>
                        ) : ("Logout")}
                    </button>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar