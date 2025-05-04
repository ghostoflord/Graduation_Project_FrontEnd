import Slider from "@/pages/home/slider/slider";
import ProductList from "@/pages/home/product/product.list.home";
import Banner from "../banner/banner.home";
import ScrollToTop from "@/components/scrolltotop/scrolltotop";

const HomePage = () => {
    return (
        <>
            <ScrollToTop />
            <Banner />
            <Slider />
            <ProductList />
        </>
    );
};

export default HomePage;
