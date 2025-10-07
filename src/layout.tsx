import { Outlet, useLocation } from "react-router-dom";
import Footer from "./pages/home/footer/home.footer";
import Header from "./pages/home/header/home.header";
import ScrollToTop from "./components/scrolltotop/scrolltotop";

import { useEffect, useState } from "react";
import ProductBreadcrumb from "./pages/productbreadcrumb/product.bread.crumb";

const LayoutPage = () => {
  const location = useLocation();
  const [breadcrumbInfo, setBreadcrumbInfo] = useState<{ brand?: string; name?: string }>({});

  useEffect(() => {
    if (location.pathname.startsWith("/product/")) {
      const productData = localStorage.getItem("currentProduct");
      if (productData) {
        setBreadcrumbInfo(JSON.parse(productData));
      }
    } else {
      setBreadcrumbInfo({});
    }
  }, [location.pathname]);

  const isProductDetail = location.pathname.startsWith("/product/");

  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        {isProductDetail && breadcrumbInfo.name && (
          <div style={{ margin: "20px 0" }}>
            <ProductBreadcrumb brand={breadcrumbInfo.brand} name={breadcrumbInfo.name} />
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LayoutPage;
