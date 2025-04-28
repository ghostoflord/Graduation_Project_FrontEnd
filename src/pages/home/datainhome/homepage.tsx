import Slider from "@/pages/home/slider/slider";
import ProductList from "@/pages/home/product/product.list.home";
import Banner from "../banner/banner.home";

const HomePage = () => {
    return (
        <>
            <Banner />
            <Slider />
            <ProductList />
        </>
    );
};

export default HomePage;
