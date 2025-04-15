import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import LoginPage from './pages/admin/login/login.page.tsx';
import { ConfigProvider } from 'antd';
import { AppProvider } from './components/context/app.context.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <AppProvider>
      <ConfigProvider >
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppProvider>

  </StrictMode>,
);
