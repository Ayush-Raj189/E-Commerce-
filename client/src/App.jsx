import './App.css'
import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import CheckAuth from "./components/common/check-auth.jsx";
import AuthLayout from './components/auth/layout.jsx';
import AuthLogin from "./pages/auth/login.jsx";
import AuthRegister from "./pages/auth/register.jsx";
import AdminLayout from "./components/admin-view/layout.jsx";
import AdminDashboard from "./pages/admin-view/dashboard.jsx";
import AdminProducts from "./pages/admin-view/products.jsx";
import AdminOrders from "./pages/admin-view/orders.jsx";
import AdminFeatures from "./pages/admin-view/features.jsx";
import NotFound from "./pages/not-found/index.jsx";
import ShoppingLayout from "./components/shopping-view/layout.jsx";
import ShoppingHome from "./pages/shopping-view/home.jsx";
import ShoppingListing from "./pages/shopping-view/listing.jsx";
import ShoppingAccount from "./pages/shopping-view/account.jsx";
import ShoppingCheckout from "./pages/shopping-view/checkout.jsx";
import UnauthPage from "./pages/unauth-page/index.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import PaypalReturnPage from './pages/shopping-view/paypal-return.jsx';
import PaymentSuccessPage from './pages/shopping-view/payment-success.jsx';
import SearchProducts from './pages/shopping-view/search.jsx';

const App = () => {
  const { user, isAuthenticated,isLoading } = useSelector((state) => state.auth);
  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(checkAuth())
  },[dispatch])

  if(isLoading){
    return <Skeleton className="w-[600px] h-[600px]"/>
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout />
        </CheckAuth>
      ),
      children: [
        { index: true, element: <ShoppingHome /> },
      ],
    },
    {
      path: "/auth",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout />
        </CheckAuth>
      ),
      children: [
        { path: "login", element: <AuthLogin /> },
        { path: "register", element: <AuthRegister /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AdminLayout />
        </CheckAuth>
      ),
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "products", element: <AdminProducts /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "features", element: <AdminFeatures /> },

      ],
    },
    {
      path: "/shop",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout />
        </CheckAuth>
      ),
      children: [
        { path: "home", element: <ShoppingHome /> },
        { path: "listing", element: <ShoppingListing /> },
        { path: "account", element: <ShoppingAccount /> },
        { path: "checkout", element: <ShoppingCheckout /> },
        { path: "paypal-return", element: <PaypalReturnPage /> },
        { path: "payment-success", element: <PaymentSuccessPage /> },
        { path: "search", element: <SearchProducts /> }
      ],
    },
    { path: "/unauth-page", element: <UnauthPage /> },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <div className="flex flex-col overflow-hidden bg-white min-h-screen">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default App;
