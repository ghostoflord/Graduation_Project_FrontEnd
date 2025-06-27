import { useEffect, useState } from 'react';
import TableProductDetailMobile from './table.product.detail.mobile';
import TableProductDetail from '../table.product.detail';


const TableProductDetailResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TableProductDetailMobile /> : <TableProductDetail />;
};

export default TableProductDetailResponsive;
