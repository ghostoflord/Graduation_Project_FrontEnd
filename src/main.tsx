import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from '@/pages/admin/login/login.page.tsx';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from '@/components/context/app.context.tsx';
import RegisterPage from '@/pages/admin/register/register.tsx';
import LayoutPage from '@/layout.tsx';
import AdminPage from '@/pages/admin/layout/admin.tsx';
import UserPage from '@/pages/admin/layout/user.tsx';
import ProductPage from '@/pages/admin/layout/product.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
  },

  {
    path: "/admin",
    element: <AdminPage />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "product",
        element: <ProductPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider >
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode >,
);
