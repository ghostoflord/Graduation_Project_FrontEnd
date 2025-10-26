import Slider from "@/pages/home/slider/slider";
import ProductList from "@/pages/home/product/product.list.home";
import Banner from "../banner/banner.home";
import ScrollToTop from "@/components/scrolltotop/scrolltotop";
import ChatWidget from "@/pages/chatbot/chat.widget";
import FlashSaleList from "@/components/admin/flashsale/flash.sale.list";

const HomePage = () => {
    return (
        <>
            <ScrollToTop />
            <Banner />
            <Slider />
            <div className="white-bg-section">
                <ProductList />
            </div>
            <FlashSaleList />
            <ChatWidget />
        </>
    );
};

export default HomePage;
