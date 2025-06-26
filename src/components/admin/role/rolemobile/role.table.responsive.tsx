import React, { useEffect, useState } from 'react';
import TableRoleMobile from './table.role.mobile'; // bản mobile chỉ hiển thị
import TableRole from '../table.role'; // bản desktop đầy đủ chức năng

interface Props {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    reloadTable: () => void;
    singleRole: any; // nên đổi thành IRole nếu có
    setSingleRole: (role: any) => void;
    listPermissions: any[];
}

const TableRoleResponsive: React.FC<Props> = ({
    openModal,
    setOpenModal,
    reloadTable,
    singleRole,
    setSingleRole,
    listPermissions,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
    };

    useEffect(() => {
        handleResize(); // gọi khi mount lần đầu
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (isMobile) {
        return <TableRoleMobile />;
    }

    return (
        <TableRole
            openModal={openModal}
            setOpenModal={setOpenModal}
            reloadTable={reloadTable}
            singleRole={singleRole}
            setSingleRole={setSingleRole}
            listPermissions={listPermissions}
        />
    );
};

export default TableRoleResponsive;
