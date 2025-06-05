import { useEffect } from "react";
import Background from "../../assets/loginBg.jpg"

var LoginBg = {
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
    }
    
}

const LoginForm = () => {
    useEffect(() => {
    document.title = "Login";
    }, [])
  return (
    <>
    <div style={LoginBg.header}>
        <div className="row d-flex align-items-center" style={LoginBg.content}>
            <div className="d-flex justify-content-center">
                <div className="col-md-4 bg-light bg-opacity-75 p-4 rounded">
                    <h3>Welcome back!</h3>
                    <form action="">
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control" name="email" id="email" />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="text" className="form-control" name="password" id="password" />
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">Log in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default LoginForm