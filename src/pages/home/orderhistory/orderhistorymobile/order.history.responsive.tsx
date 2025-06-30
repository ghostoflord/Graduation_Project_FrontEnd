import { useEffect, useState } from 'react';
import OrderHistoryMobile from './order.history.mobile';
import OrderHistory from '../ordet.history';


const OrderHistoryResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <OrderHistoryMobile /> : <OrderHistory />;
};

export default OrderHistoryResponsive;



