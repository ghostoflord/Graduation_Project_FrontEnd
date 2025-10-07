import './banner.home.scss';
import banner from '@/assets/banner.webp';

const Banner = () => {
    return (
        <div className="banner">
            <img src={banner} alt="MSI RTX 50 Banner" />
        </div>
    );
};

export default Banner;
