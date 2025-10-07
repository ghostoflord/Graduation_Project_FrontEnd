import "./product.breadcrumb.scss";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface ProductBreadcrumbProps {
    brand?: string;
    name: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ brand, name }) => {
    return (
        <div className="product-breadcrumb">
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
                    brand
                        ? {
                            title: (
                                <Link to={`/product/${brand.toLowerCase()}`}>
                                    {brand.toUpperCase()}
                                </Link>
                            ),
                        }
                        : undefined,
                    {
                        title: <span>{name}</span>,
                    },
                ].filter(Boolean)}
            />
        </div>
    );
};

export default ProductBreadcrumb;
