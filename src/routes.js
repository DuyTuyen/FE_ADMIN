import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';

import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import ImportOrderPage from './pages/ImportOrderPage';
import OrderPage from './pages/OrderPage';
import ConsignmentPage from './pages/ConsignmentPage';
import { protectedAPI } from './api/ConfigAPI';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RolePage from './pages/RolePage';
import PermissionPage from './pages/PermissionPage';
// ----------------------------------------------------------------------

export default function Router() {

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      errorElement: <ErrorPage />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: 'app',
          element: <ProtectedRoute>
            <DashboardAppPage />
          </ProtectedRoute>
        },
        {
          path: 'user',
          element: <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        },
        {
          path: 'products', element: <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        },
        {
          path: 'category', element: <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        },
        {
          path: 'brand', element: <ProtectedRoute>
            <BrandPage />
          </ProtectedRoute>
        },
        {
          path: 'importorder', element: <ProtectedRoute>
            <ImportOrderPage />
          </ProtectedRoute>
        },
        {
          path: 'order', element: <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        },
        {
          path: 'consignment', element: <ProtectedRoute>
            <ConsignmentPage />
          </ProtectedRoute>
        },
        {
          path: 'role', element: <ProtectedRoute>
            <RolePage />
          </ProtectedRoute>
        },
        {
          path: 'permission', element: <ProtectedRoute>
            <PermissionPage />
          </ProtectedRoute>
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'error', element: <ErrorPage /> },
        { path: '*', element: <Navigate to="/error" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/error" replace />,
    },
  ]);

  return routes;
}

function ProtectedRoute(props) {
  const {  children } = props
  const [isAuthor, setIsAuthor] = useState(false)
  const token = useSelector(state => state.token.value)
  const navigate = useNavigate()
  useEffect(() => {
    async function checkRoute() {
      try {
        await protectedAPI.checkRoute(token)
        setIsAuthor(true)
      } catch (error) {
        if (axios.isAxiosError(error))
          alert((error.response ? error.response.data.message : error.message));
        else
          alert((error.toString()));
        navigate("/login")
      }
    }
    checkRoute()
  }, [children])

  return (
    isAuthor && children 
  );
}   