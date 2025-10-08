// src/components/common/CommonBreadcrumb.tsx
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./about.breadcrumb.scss";

interface CommonBreadcrumbProps {
    current: string; // Tên trang hiện tại, vd: "Giới thiệu"
}

const CommonBreadcrumb: React.FC<CommonBreadcrumbProps> = ({ current }) => {
    return (
        <div className="common-breadcrumb">
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
                        title: <span>{current}</span>,
                    },
                ]}
            />
        </div>
    );
};

export default CommonBreadcrumb;
