import { Outlet } from "react-router-dom";
import Footer from "./pages/home/footer/home.footer"
import Header from "./pages/home/header/home.header"
import Slider from "./pages/home/slider/slider"
import ProductList from "./pages/home/product/product.list.home";

const LayoutPage = () => {
  return (
    <>
      <div>
        <Header />
        <Slider />
        <ProductList />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default LayoutPage
