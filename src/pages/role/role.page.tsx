import { useState, useEffect } from "react";
import TableRole from "@/components/admin/role/table.role";
import { callFetchPermissions } from "@/services/api";
import { groupByPermission } from "@/utils/config";

const RolePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [singleRole, setSingleRole] = useState<IRole | null>(null);
    const [listPermissions, setListPermissions] = useState([]);

    const reloadTable = () => {
    }

    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await callFetchPermissions("");
            console.log(">>> API response:", res);
            const rawPermissions = res?.data?.result || [];
            console.log(">>> Raw permissions:", rawPermissions);
            const grouped = groupByPermission(rawPermissions);
            console.log(">>> Grouped permissions:", grouped);
            setListPermissions(grouped);
        };
        fetchPermissions();
    }, []);


    return (
        <div>
            {listPermissions.length > 0 && (
                <TableRole
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={reloadTable}
                    listPermissions={listPermissions}
                    singleRole={singleRole}
                    setSingleRole={setSingleRole}
                />
            )}
        </div>
    );
};


export default RolePage;
