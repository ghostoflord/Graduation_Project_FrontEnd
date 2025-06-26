import { useState, useEffect } from "react";

import { callFetchPermissions } from "@/services/api";
import { groupByPermission } from "@/utils/config";
import TableRoleResponsive from "@/components/admin/role/rolemobile/role.table.responsive";

const RolePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [singleRole, setSingleRole] = useState<IRole | null>(null);
    const [listPermissions, setListPermissions] = useState([]);

    const reloadTable = () => {
        // TODO: Nếu cần reload
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await callFetchPermissions("");
            const rawPermissions = res?.data?.result || [];
            const grouped = groupByPermission(rawPermissions);
            setListPermissions(grouped);
        };
        fetchPermissions();
    }, []);

    return (
        <div>
            {listPermissions.length > 0 && (
                <TableRoleResponsive
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={reloadTable}
                    singleRole={singleRole}
                    setSingleRole={setSingleRole}
                    listPermissions={listPermissions}
                />
            )}
        </div>
    );
};

export default RolePage;
