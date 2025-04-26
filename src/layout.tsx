import { Outlet } from "react-router-dom";
import Footer from "./pages/home/footer/home.footer"
import Header from "./pages/home/header/home.header"
import Slider from "./pages/home/slider/slider"

const LayoutPage = () => {
  return (
    <>
      <div>
        <Header />
        <Slider />
        <Outlet />  
        <Footer />
      </div>
    </>
  )
}

export default LayoutPage
