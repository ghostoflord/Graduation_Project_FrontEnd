import { useEffect, useState } from 'react';

import CheckoutPage from './checkout.page';
import CheckoutMobile from './checkoutpagemobile/checkout.mobile';

const CheckoutResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <CheckoutMobile /> : <CheckoutPage />;
};

export default CheckoutResponsive;
