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
import HomePage from './pages/home/datainhome/homepage';
import AboutCompany from './pages/home/header/introducedropdown/aboutcompany/aboutcompany';
import VisionMission from './pages/home/header/introducedropdown/visionmission/vision.mission';
import ContactInfo from './pages/home/header/contactinfo/contact.info';
import FranchiseInfo from './pages/home/header/franchiseinfo/franchise.info';
import RecruitmentInfo from './pages/home/header/recruitmentinfo/recruitment.info';
import PageUnderConstruction from './pages/home/header/pageunderconstruction/page.under.construction';
import SalesPolicy from './pages/home/header/salespolicy/sales.policy';
import ProductDetail from './pages/home/product/product.detail';
import AdminDashboard from './components/admin/dashboard/admin.dashboard';
import ReturnPolicy from './pages/home/footer/returnpolicy/return.policy';
import ShippingPolicy from './pages/home/footer/shippingpolicy/shipping.policy';
import PaymentPolicy from './pages/home/footer/paymentpolicy/payment.policy';
import PrivacyPolicy from './pages/home/footer/privacypolicy/privacy.policy';
import AccountPage from './pages/home/accountpage/account.page';
import OrderHistory from './pages/home/orderhistory/ordet.history';
import Oauth2Redirect from './pages/client/auth/login/Oauth2Redirect';
import CheckoutResponsive from './pages/home/checkoutpage/checkout.responsive';
import CartResponsive from './pages/home/cart/cartmobile/cart.responsive';

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
        path: "/product/:slug",
        element: <ProductDetail />
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
        path: "san-pham",
        element: <ProductPage />
      },
      {
        path: "lien-he",
        element: <ContactInfo />
      },
      {
        path: "nhuong-quyen",
        element: <FranchiseInfo />
      },
      {
        path: "tuyen-dung",
        element: <RecruitmentInfo />
      },
      {
        path: "tin-tuc",
        element: <PageUnderConstruction />
      },
      {
        path: "chinh-sach-ban-hang",
        element: <SalesPolicy />
      },
      {
        path: "tra-cuu-bao-hanh",
        element: <PageUnderConstruction />
      },
      {
        path: "gio-hang",
        element: <CartResponsive />
      },
      {
        path: "thanh-toan",
        element: <CheckoutResponsive />
      },
      {
        path: "doi-tra",
        element: <ReturnPolicy />
      },
      {
        path: "van-chuyen",
        element: <ShippingPolicy />
      },
      {
        path: "phuong-thuc-thanh-toan",
        element: <PaymentPolicy />
      },
      {
        path: "bao-mat",
        element: <PrivacyPolicy />
      },
      {
        path: "profile",
        element: < AccountPage />
      },
      {
        path: "lich-su-mua-hang",
        element: < OrderHistory />
      },
    ]
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
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
    path: "/oauth2/redirect",
    element: <Oauth2Redirect />
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
