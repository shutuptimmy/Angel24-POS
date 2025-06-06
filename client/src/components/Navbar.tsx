import { Link } from "react-router-dom";
import Logo from "../assets/angels24-logo.png"

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
            title: "Reports & Statistics",
        },
        {
            route: "/accounts",
            title: "Account Management",
        },
    ];

  return (
    <>
        <nav className="navbar navbar-expand-lg bg-primary rounded-bottom mb-3">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src={Logo} className="rounded-4" width={50} alt="Angels24-logo"/>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse fw-medium text-white" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        {menuItems.map((menuItem, index) => (
                            <li className="nav-item" key={index}>
                                <Link className="nav-link fw-medium text-white" to={menuItem.route}>{menuItem.title} </Link>
                            </li>
                        ))}
                    </ul>
                    <b className="px-4">Logged in as Wendylle (Admin)</b>
                    <b className="">Logout</b>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar