import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./pages/product/Products";
import LoginForm from "./components/forms/LoginForm";
import Stocks from "./pages/product/Stocks";
import Users from "./pages/Users";
import Orders from "./pages/order/Orders";
import Cashier from "./pages/Cashier";

const router = createBrowserRouter([
  {
    path: '/login', 
    element: <LoginForm />
  },
  {
    path: '/home', 
    element: <Cashier />
  },
  {
    path: '/', 
    element: <Products />
  },
  {
    path: '/stocks', 
    element: <Stocks />
  },
  {
    path: '/accounts', 
    element: <Users />
  },
  {
    path: '/orders', 
    element: <Orders />
  },
  // {
  //   path: '/feedback', 
  //   element: <Orders />
  // },
  
])

const App = () => {
  return <RouterProvider router={router} />
};

export default App