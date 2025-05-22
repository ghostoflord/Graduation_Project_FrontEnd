import { useEffect, useState } from 'react';
import CartMobile from './cart.mobile';
import CartPage from '../cart.page';


const CartResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <CartMobile /> : <CartPage />;
};

export default CartResponsive;
