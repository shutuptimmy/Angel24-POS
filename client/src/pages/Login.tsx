import { useEffect } from "react";
import Background from "../assets/loginBg.jpg" // Ensure this path is correct
import Logo from "../assets/angels24-icon-transparent.png"   // Ensure this path is correct

const Login = () => {
    useEffect(() => {
        document.title = "Login";
    }, [])


    const backgroundStyle = {
        backgroundImage: `url(${Background})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        minHeight: '100vh',
    };

    return (
        <div style={backgroundStyle} className="d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 bg-light bg-opacity-75 rounded shadow-lg overflow-hidden">
                        <div className="row">
                            <div className="col-md-6 d-flex align-items-center justify-content-center p-3 p-md-4">
                                <img src={Logo} alt="Angels24 Logo" className="img-fluid mx-auto d-block w-auto rounded"/>
                            </div>

                            <div className="col-md-6 p-4">
                                <h3 className="mb-4 text-center">Welcome back!</h3>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control rounded" name="email" id="email"/>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className="form-control rounded" name="password" id="password"/>
                                    </div>

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary rounded">Log in</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;