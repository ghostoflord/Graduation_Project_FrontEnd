import { Outlet } from "react-router-dom";
import Footer from "./pages/home/footer/home.footer"
import Header from "./pages/home/header/home.header"
import NewsletterForm from "./pages/home/newlistform/home.newlistform";
import Slider from "./pages/home/slider/slider"

const LayoutPage = () => {


  const slides = [
    { id: 1, image: "/banner1.jpg", alt: "Banner 1" },
    { id: 2, image: "/banner2.jpg", alt: "Banner 2" },
    { id: 3, image: "/banner3.jpg", alt: "Banner 3" },
  ];
  return (
    <>
      <div>
        <Header />
        <Slider slides={slides} />
        <Outlet />

        <Footer />


      </div>
    </>
  )
}

export default LayoutPage
