// src/components/Banner/index.tsx
import './banner.home.scss';
import bannerImg from '@/assets/banner.png'; //   banner hình ảnh bạn dùng

const Banner = () => {
    return (
        <div className="banner">
            <img src={bannerImg} alt="MSI RTX 50 Banner" />
        </div>
    );
};

export default Banner;
