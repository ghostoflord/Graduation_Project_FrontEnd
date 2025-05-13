import { useEffect, useState } from 'react';
import CartMobile from './cart.mobile';
import CartPage from '../cart.page';


const CartResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000); // Điều kiện xác định thiết bị di động
    };

    useEffect(() => {
        handleResize(); // Kiểm tra ngay khi component mount
        window.addEventListener('resize', handleResize); // Lắng nghe thay đổi kích thước
        return () => window.removeEventListener('resize', handleResize); // Dọn dẹp khi unmount
    }, []);

    return isMobile ? <CartMobile /> : <CartPage />;
};

export default CartResponsive;
