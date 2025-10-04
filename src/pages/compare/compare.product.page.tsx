import { useEffect, useState } from "react";
import { Table, Typography, Spin, message } from "antd";
import { useSearchParams } from "react-router-dom";
import { compareProductsAPI } from "@/services/api";
import "./compare.product.page.scss";
import PageWarning from "../home/header/pageunderconstruction/pagewarning/page.warning";
const { Title } = Typography;

const fields: { key: keyof CompareProductDTO; label: string }[] = [
    { key: "cpu", label: "CPU" },
    { key: "ram", label: "RAM" },
    { key: "storage", label: "Storage" },
    { key: "gpu", label: "GPU" },
    { key: "screen", label: "Screen" },
    { key: "battery", label: "Battery" },
    { key: "weight", label: "Weight" },
    { key: "material", label: "Material" },
    { key: "os", label: "Hệ điều hành" },
    { key: "specialFeatures", label: "Tính năng đặc biệt" },
    { key: "ports", label: "Cổng kết nối" },
];

const CompareProductPage = () => {
    const [params] = useSearchParams();
    const [products, setProducts] = useState<CompareProductDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const idsParam = params.get("ids");
        if (!idsParam) {
            message.warning("Vui lòng chọn 2 sản phẩm để so sánh");
            return;
        }

        const ids = idsParam.split(",").map(Number);
        if (ids.length !== 2) {
            message.warning("Bạn phải chọn đúng 2 sản phẩm để so sánh");
            return;
        }

        compareProductsAPI(ids).then((res) => {
            setProducts(res.data || []);
            setLoading(false);
        });
    }, [params]);

    if (loading) {
        return (
            <div className="compare-message">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    if (products.length < 2) {
        return (
            <div className="compare-message">
                <PageWarning />
            </div>
        );
    }

    const [productA, productB] = products;

    const data = [
        {
            key: "image",
            attribute: "Ảnh sản phẩm",
            productA: (
                <img
                    src={
                        productA.image?.startsWith("http")
                            ? productA.image
                            : `${import.meta.env.VITE_BACKEND_URL}/upload/products/${productA.image}`
                    }
                    alt={productA.name}
                    style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                    }}
                />
            ),
            productB: (
                <img
                    src={
                        productB.image?.startsWith("http")
                            ? productB.image
                            : `${import.meta.env.VITE_BACKEND_URL}/upload/products/${productB.image}`
                    }
                    alt={productB.name}
                    style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                    }}
                />
            ),
        },
        {
            key: "name",
            attribute: "Tên sản phẩm",
            productA: <strong>{productA.name}</strong>,
            productB: <strong>{productB.name}</strong>,
        },
        ...fields.map(({ key, label }) => {
            const valueA = productA[key] ?? "";
            const valueB = productB[key] ?? "";
            const isDifferent = valueA !== valueB;

            return {
                key,
                attribute: label,
                productA: (
                    <span className={isDifferent ? "diff-value" : ""}>
                        {valueA}
                    </span>
                ),
                productB: (
                    <span className={isDifferent ? "diff-value" : ""}>
                        {valueB}
                    </span>
                ),
            };
        }),
    ];

    const columns = [
        {
            title: "Thuộc tính",
            dataIndex: "attribute",
            key: "attribute",
            width: "30%",
            className: "compare-attr",
        },
        {
            title: "Sản phẩm 1",
            dataIndex: "productA",
            key: "productA",
            width: "35%",
            align: "center" as const,
        },
        {
            title: "Sản phẩm 2",
            dataIndex: "productB",
            key: "productB",
            width: "35%",
            align: "center" as const,
        },
    ];

    return (
        <div className="compare-container">
            <Title level={3} className="compare-title">
                So sánh sản phẩm
            </Title>
            <Table
                className="compare-table"
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                rowKey="key"
            />
        </div>
    );
};


export default CompareProductPage;
