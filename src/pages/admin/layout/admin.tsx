import AdminPage from "@/components/layout/admin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <>
            <div>
                <AdminPage />
                <Outlet />
            </div>
        </>

    )
}
export default AdminLayout;