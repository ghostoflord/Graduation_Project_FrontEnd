import "./cart.breadcrumb.scss";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const CartBreadcrumb = () => {
    return (
        <div className="cart-breadcrumb">
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
                        title: <span>Giỏ hàng</span>,
                    },
                ]}
            />
        </div>
    );
};

export default CartBreadcrumb;
