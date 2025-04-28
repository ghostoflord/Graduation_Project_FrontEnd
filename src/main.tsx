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
import CoreValues from './pages/home/header/introducedropdown/corevalues/core.vales';
import HomePage from './pages/home/home/homepage';
import AboutCompany from './pages/home/header/introducedropdown/aboutcompany/aboutcompany';
import VisionMission from './pages/home/header/introducedropdown/visionmission/vision.mission';
import ContactInfo from './pages/home/header/contactinfo/contact.info';
import FranchiseInfo from './pages/home/header/franchiseinfo/franchise.info';
import RecruitmentInfo from './pages/home/header/recruitmentinfo/recruitment.info';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "", element: <HomePage />
      },
      {
        path: "gioi-thieu",
        element: <AboutCompany />
      },
      {
        path: "tam-nhin-su-menh",
        element: <VisionMission />
      },
      {
        path: "gia-tri-cot-loi",
        element: <CoreValues />
      },
      {
        path: "san-pham", element: <ProductPage />
      },
      {
        path: "lien-he", element: <ContactInfo />
      },
      {
        path: "nhuong-quyen", element: <FranchiseInfo />
      },
      {
        path: "tuyen-dung", element: <RecruitmentInfo />
      },
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
