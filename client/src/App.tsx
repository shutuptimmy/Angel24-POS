import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Stocks from "./pages/Stocks";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Cashier from "./pages/Cashier";
import Feedback from "./pages/Feedback";
import Statistics from "./pages/Statistics";

const router = createBrowserRouter([
  {
    path: '/login', 
    element: <Login />
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
  {
    path: '/feedback', 
    element: <Feedback />
  },
  {
    path: '/statistics', 
    element: <Statistics />
  },
  
])

const App = () => {
  return <RouterProvider router={router} />
};

export default App