import { useEffect, useState } from 'react';
import TableVoucher from '../voucher.table';
import TableVoucherMobile from './voucher.table.mobile';


const TableVoucherResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TableVoucherMobile /> : <TableVoucher />;
};

export default TableVoucherResponsive;
