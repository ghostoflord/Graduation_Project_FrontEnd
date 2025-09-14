import { useEffect, useState } from "react";
import { Table, Typography, Spin, message } from "antd";
import { useSearchParams } from "react-router-dom";
import { compareProductsAPI } from "@/services/api";
import "./compare.product.page.scss";
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

    if (loading) return <Spin />;
    if (products.length < 2) {
        return <div>Không đủ sản phẩm để so sánh.</div>;
    }
    const [productA, productB] = products;

    const data = fields.map(({ key, label }) => {
        const valueA = productA[key] ?? "";
        const valueB = productB[key] ?? "";
        const isDifferent = valueA !== valueB;

        return {
            key,
            attribute: label,
            productA: (
                <span className={isDifferent ? "diff-value" : ""}>{valueA}</span>
            ),
            productB: (
                <span className={isDifferent ? "diff-value" : ""}>{valueB}</span>
            ),
        };
    });

    const columns = [
        {
            title: "Thuộc tính",
            dataIndex: "attribute",
            key: "attribute",
            width: "30%",
            className: "compare-attr", // giờ chỉ in đậm chữ
        },
        {
            title: productA.name,
            dataIndex: "productA",
            key: "productA",
            width: "35%",
        },
        {
            title: productB.name,
            dataIndex: "productB",
            key: "productB",
            width: "35%",
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
            />
        </div>
    );

};

export default CompareProductPage;
