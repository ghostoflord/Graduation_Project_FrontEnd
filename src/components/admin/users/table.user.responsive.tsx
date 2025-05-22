import { useEffect, useState } from 'react';
import TableUserMobile from './usermobile/table.user.mobile';
import TableUser from './table.user';

const TableUserResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TableUserMobile /> : <TableUser />;
};

export default TableUserResponsive;
