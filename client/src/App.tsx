import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Stocks from "./pages/Stocks";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Cashier from "./pages/Cashier";
import Feedback from "./pages/Feedback";
import Statistics from "./pages/Statistics";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: '/login', 
    element: <Login />
  },
  {
    path: '/', 
    element: (
        <ProtectedRoute>
          <Cashier />

        </ProtectedRoute>
    )
  },
  {
    path: '/inventory', 
    element: (
      <ProtectedRoute>
        <Products />

      </ProtectedRoute>
    )
  },
  {
    path: '/stocks', 
    element: (
      <ProtectedRoute>

        <Stocks />
      </ProtectedRoute>
    )
  },
  {
    path: '/accounts', 
    element: (
      <ProtectedRoute>
        <Users />

      </ProtectedRoute>
    )
  },
  {
    path: '/orders', 
    element: (
      <ProtectedRoute>
        <Orders />

      </ProtectedRoute>
    )
  },
  {
    path: '/feedback', 
    element: (
      <ProtectedRoute>
        <Feedback />

      </ProtectedRoute>
    )
  },
  {
    path: '/statistics', 
    element: (
      <ProtectedRoute>
        <Statistics />

      </ProtectedRoute>
    )
  },
  
])

const App = () => {
  return <RouterProvider router={router} />
};

export default App