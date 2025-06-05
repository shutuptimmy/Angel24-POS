import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./pages/product/Products";
import Homepage from "./pages/Homepage";
import LoginForm from "./components/forms/LoginForm";
import Stocks from "./pages/product/Stocks";

const router = createBrowserRouter([
  {
    path: '/login', 
    element: <LoginForm />
  },
  {
    path: '/home', 
    element: <Homepage />
  },
  {
    path: '/', 
    element: <Products />
  },
  {
    path: '/stocks', 
    element: <Stocks />
  },
])

const App = () => {
  return <RouterProvider router={router} />
};

export default App