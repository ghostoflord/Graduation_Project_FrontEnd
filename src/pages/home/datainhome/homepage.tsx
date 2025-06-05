import Slider from "@/pages/home/slider/slider";
import ProductList from "@/pages/home/product/product.list.home";
import Banner from "../banner/banner.home";
import ScrollToTop from "@/components/scrolltotop/scrolltotop";
import ChatWidget from "@/pages/chatbot/chat.widget";
import { ChatBot } from "@/pages/chatbot/chat.bot";

const HomePage = () => {
    return (
        <>
            <ScrollToTop />
            <Banner />
            <Slider />
            <ProductList />
            <ChatWidget />
            {/* <ChatBot /> */}
        </>
    );
};

export default HomePage;
