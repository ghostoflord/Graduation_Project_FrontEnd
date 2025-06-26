// src/components/permission/TablePermissionResponsive.tsx

import { useEffect, useState } from 'react';
import TablePermissionMobile from './table.permission.mobile';
import PermissionTable from '../table.permission';

const TablePermissionResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TablePermissionMobile /> : <PermissionTable />;
};

export default TablePermissionResponsive;
