import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from '@/pages/client/auth/login/login.page';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from '@/components/context/app.context.tsx';
import RegisterPage from '@/pages/client/auth/register/register';
import LayoutPage from '@/layout.tsx';
import AdminLayout from './pages/admin/admin';
import UserPage from './pages/user';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "user",
        element: <UserPage />,
      },
      // {
      //   path: "product",
      //   element: <ProductPage />,
      // },
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
