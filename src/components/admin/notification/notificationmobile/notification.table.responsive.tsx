import { useEffect, useState } from 'react';
import NotificationTableMobile from './notification.table.mobile';
import NotificationTable from '../notification.table';

const NotificationTableResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <NotificationTableMobile /> : <NotificationTable />;
};

export default NotificationTableResponsive;
