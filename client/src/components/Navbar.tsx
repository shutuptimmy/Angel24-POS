import { Link } from "react-router-dom";
import Logo from "../assets/angels24-logo.png"
import { useCallback, useState } from "react";

const Navbar = () => {
    const menuItems = [
        {
            route: "/",
            title: "Inventory",
        },
        {
            route: "/stocks",
            title: "Stock Monitoring",
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

    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    
    const handleNavCollapse = useCallback(() => {
        setIsNavCollapsed(!isNavCollapsed);
    }, [isNavCollapsed]);

  return (
    <>
        <nav className="navbar navbar-expand-lg bg-primary rounded-bottom mb-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={Logo} className="rounded-4" width={50} alt="Angels24-logo"/>
                </Link>

                
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

                    <div className="d-flex align-items-center flex-column flex-lg-row text-white ms-lg-auto">
                        <b className="px-lg-4 mb-2 mb-lg-0">Logged in as You</b>
                        <Link to="/logout" className="btn btn-outline-light">Logout</Link>
                    </div>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar