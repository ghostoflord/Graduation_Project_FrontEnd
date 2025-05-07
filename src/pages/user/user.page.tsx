import TableUser from "@/components/admin/users/table.user";
import TableUserResponsive from "@/components/admin/users/table.user.responsive";
import TableUserMobile from "@/components/admin/users/usermobile/table.user.mobile";

const UserPage = () => {
    return (
        <>
            <div>
                <TableUserResponsive />
                {/* <TableUserMobile /> */}
            </div>
        </>

    )
}
export default UserPage;