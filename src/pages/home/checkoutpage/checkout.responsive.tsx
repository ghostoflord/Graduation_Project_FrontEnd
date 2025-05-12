import { useEffect, useState } from 'react';
import CheckoutMobile from './checkoutpagemobile/checkout.Mobile';
import CheckoutPage from './checkout.page';

const CheckoutResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000); // Ngưỡng có thể điều chỉnh
    };

    useEffect(() => {
        handleResize(); // gọi khi load lần đầu
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <CheckoutMobile /> : <CheckoutPage />;
};

export default CheckoutResponsive;
