import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { ConfigProvider, App as AntdApp } from 'antd';

import LoginPage from '@/pages/client/auth/login/login.page';
import RegisterPage from '@/pages/client/auth/register/register';
import LayoutPage from '@/layout.tsx';
import UserPage from '@/pages/user/user.page';
import AdminPage from '@/pages/admin/admin.page';
import ProductPage from '@/pages/product/product.page';
import OrderPage from '@/pages/order/order.page';
import ErrorPage from '@/pages/error/error.page';
import { AppProvider } from '@/components/context/app.context';
import CoreValues from './pages/home/corevalues/CoreValues';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      
      {
        path: "gia-tri-cot-loi",
        element: <CoreValues />
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "*", // Cần có để bắt tất cả path con không đúng trong /admin
        element: <ErrorPage />,
      }
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*", // Catch-all cho route ngoài admin
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AntdApp>
      <AppProvider>
        <ConfigProvider>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </AntdApp>
  </StrictMode>
);
