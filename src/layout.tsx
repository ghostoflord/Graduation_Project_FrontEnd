import { Outlet } from "react-router-dom";
import Footer from "./pages/home/footer/home.footer";
import Header from "./pages/home/header/home.header";
import ScrollToTop from "./components/scrolltotop/scrolltotop";

const LayoutPage = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LayoutPage;
