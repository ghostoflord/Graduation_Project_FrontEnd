import "./product.factory.breadcrumd.scss";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const FactoryBreadcrumb = () => {
    return (
        <div className="factory-breadcrumb">
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
                        title: <span>Danh sách sản phẩm</span>,
                    },
                ]}
            />
        </div>
    );
};

export default FactoryBreadcrumb;
