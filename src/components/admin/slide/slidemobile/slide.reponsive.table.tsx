import { useEffect, useState } from 'react';
import TableSlideMobile from './slide.table.mobile';
import TableSlide from '../slide.table';

const SlideTableResponsive = () => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1000);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <TableSlideMobile /> : <TableSlide />;
};

export default SlideTableResponsive;
