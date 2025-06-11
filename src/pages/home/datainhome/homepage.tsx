import Slider from "@/pages/home/slider/slider";
import ProductList from "@/pages/home/product/product.list.home";
import Banner from "../banner/banner.home";
import ScrollToTop from "@/components/scrolltotop/scrolltotop";
import ChatWidget from "@/pages/chatbot/chat.widget";

const HomePage = () => {
    return (
        <>
            <ScrollToTop />
            <Banner />
            <Slider />
            <ProductList />
            <ChatWidget />
        </>
    );
};

export default HomePage;
