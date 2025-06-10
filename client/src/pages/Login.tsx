import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Background from "../assets/loginBg.jpg" // Ensure this path is correct
import Logo from "../assets/angels24-icon-transparent.png"   // Ensure this path is correct
import ErrorHandler from "../components/handler/ErrorHandler";
import type { LoginFieldErrors } from "../components/interfaces/LoginFieldErrors";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import SmolSpinner from "../components/SmolSpinner";

const Login = () => {
    const { login } = useAuth();
   const navigate = useNavigate();
 
   const [state, setState] = useState({
     loadingLogin: false,
     email: "",
     password: "",
     errors: {} as LoginFieldErrors,
   });
 
   const [message, setMessage] = useState("");
   const [isSuccess, setIsSuccess] = useState(false);
   const [isVisible, setIsVisible] = useState(false);
 
   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
 
     setState((prevState) => ({
       ...prevState,
       [name]: value,
     }));
   };
 
   const handleLogin = (e: FormEvent) => {
     e.preventDefault();
 
     setState((prevState) => ({
       ...prevState,
       loadingLogin: true,
     }));
 
     login(state.email, state.password)
       .then(() => {
         navigate("/");
       })
       .catch((error) => {
         if (error.response.status === 422) {
           setState((prevState) => ({
             ...prevState,
             errors: error.response.data.errors,
           }));
         } else if (error.response.status === 401) {
           handleShowAlertMessage(error.response.data.message, false, true);
         } else {
           ErrorHandler(error, null);
         }
       })
       .finally(() => {
         setState((prevState) => ({
           ...prevState,
           loadingLogin: false,
         }));
       });
   };
 
   const handleShowAlertMessage = (
     message: string,
     isSuccess: boolean,
     isVisible: boolean
   ) => {
     setMessage(message);
     setIsSuccess(isSuccess);
     setIsVisible(isVisible);
   };
 
   const handleCloseAlertMessage = () => {
     setMessage("");
     setIsSuccess(false);
     setIsVisible(false);
   };

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
            <AlertMessage message={message} isSuccess={isSuccess} isVisible={isVisible} onClose={handleCloseAlertMessage}/>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 bg-light bg-opacity-75 rounded shadow-lg overflow-hidden">
                        <div className="row">
                            <div className="col-md-6 d-flex align-items-center justify-content-center p-3 p-md-4">
                                <img src={Logo} alt="Angels24 Logo" className="img-fluid mx-auto d-block w-auto rounded"/>
                            </div>

                            <div className="col-md-6 p-4">
                                <h3 className="mb-4 text-center">Welcome back!</h3>
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="text" className={`form-control ${state.errors.email ? "is-invalid" : ""}`} name="email" id="email" value={state.email} onChange={handleInputChange} autoFocus/>
                                        {state.errors.email && (
                                            <span className="text-danger">{state.errors.email[0]}</span>
                                        )}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className={`form-control ${state.errors.password ? "is-invalid" : ""}`} name="password" id="password" value={state.password} onChange={handleInputChange} />
                                        {state.errors.password && (
                                            <span className="text-danger">{state.errors.password[0]}</span>
                                        )}
                                    </div>

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary" disabled={state.loadingLogin}>
                                            {state.loadingLogin ? (
                                            <>
                                                <SmolSpinner /> Logging In...
                                            </>
                                            ) : (
                                            "Login"
                                            )}
                                        </button>
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