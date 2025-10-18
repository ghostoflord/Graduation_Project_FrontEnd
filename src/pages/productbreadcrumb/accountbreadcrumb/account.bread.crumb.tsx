import "./account.breadcrumb.scss";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const AccountBreadcrumb = () => {
    const location = useLocation();

    // Xác định breadcrumb theo route
    const pathMap: Record<string, string> = {
        "/account": "Tài khoản của tôi",
        "/lich-su-mua-hang": "Lịch sử mua hàng",
        "/san-pham-yeu-thich": "Sản phẩm yêu thích",
    };

    const currentPath = location.pathname;
    const currentTitle = pathMap[currentPath] || "Tài khoản";

    return (
        <div className="account-breadcrumb">
            <Breadcrumb
                separator=">"
                items={[
                    {
                        title: (
                            <Link to="/">
                                <HomeOutlined /> Trang chủ
                            </Link>
                        ),
                    },
                    {
                        title: (
                            <span>
                                <UserOutlined /> {currentTitle}
                            </span>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default AccountBreadcrumb;
