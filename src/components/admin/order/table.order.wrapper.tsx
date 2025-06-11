import React, { useEffect, useState } from 'react';
import TableOrder from './order.table';
import TableOrderMobile from './ordermobile/table.order.mobile';

const TableOrderWrapper = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TableOrderMobile /> : <TableOrder />;
};

export default TableOrderWrapper;
