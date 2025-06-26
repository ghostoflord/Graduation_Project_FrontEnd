import { useEffect, useState } from 'react';
import TableFlashSaleMobile from './flash.sale.table.mobile';
import FlashSaleTable from '../flash.sale.table';

const FlashSaleTableResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TableFlashSaleMobile /> : <FlashSaleTable />;
};

export default FlashSaleTableResponsive;
