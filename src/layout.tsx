import { Outlet } from "react-router-dom";
import Footer from "./pages/home/footer/home.footer";
import Header from "./pages/home/header/home.header";

const LayoutPage = () => {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LayoutPage;
