import { useEffect } from "react";
import BigLogo from "../assets/angels24-icon.png"
import Background from "../assets/bg.png";
import { Link } from "react-router-dom";

var CashierBg = {
    header: {
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: `100vh`,

    },
    content: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    }
    

}

const Homepage = () => {
    useEffect(() => {
    document.title = "Home";
    }, [])
    return (
        <>
            <div style={CashierBg.header}>
                <div style={CashierBg.content}>

                    <nav className="navbar navbar-expand-lg">
                        <a className="navbar-brand">
                            <img src={BigLogo} height={80} alt="" />
                        </a>
                        <div className="d-flex align-items-baseline justify-content-end">
                            <Link to={""} className="btn btn-primary">Feedback</Link>
                            <Link to={"/login"} className="btn btn-primary">Logout</Link>
                        </div>
                    </nav>
                <div className="container-fluid row">

                    <div className="col-4">
                        Customer Name:
                        <div className="table-responsive">
                            <table className="table table-primary">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col-2">Qty</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="">
                                        <td scope="row">Borgar</td>
                                        <td scope="row">1</td>
                                        <td scope="row">20.00</td>
                                        <td scope="row">20.00</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">Tide Pod</td>
                                        <td scope="row">3</td>
                                        <td scope="row">83.25</td>
                                        <td scope="row">249.75</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th scope="row">Total:</th>
                                        <th scope="row">4</th>
                                        <th scope="row"></th>
                                        <th scope="row">268.75</th>
                                    </tr>
                                    <tr>
                                        <th scope="row">Tendered:</th>
                                        <th scope="row"><input type="text" /></th>
                                        <th scope="row"><button className="btn btn-primary">Submit</button></th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <div className="container-fluid d-flex justify-content-center">
                            <div className="">
                                <b>Product Barcode</b>
                                <form className="col-12 d-flex justify-content-center" role="search">
                                    <input className="form-control me-2" type="search" placeholder="SKU #" aria-label="Search" />
                                    <button className="btn btn-primary" type="submit">Scan</button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
                </div>
            </div>
        </>
    )
}

export default Homepage