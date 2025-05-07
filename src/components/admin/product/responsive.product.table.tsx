import { useEffect, useState } from 'react';
import TableProductMobile from './productmobile/table.product.mobile';
import TableProduct from './table.product';


const ResponsiveProductTable = () => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1000);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TableProductMobile /> : <TableProduct />;
};

export default ResponsiveProductTable;
