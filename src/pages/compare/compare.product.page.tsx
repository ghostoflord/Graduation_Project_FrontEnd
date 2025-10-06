import { useEffect, useState } from "react";
import {
    Table,
    Typography,
    Spin,
    message,
    Button,
    AutoComplete,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import {
    compareProductsAPI,
    getProductDetailAPI,
    getProductSuggestionsAPI,
} from "@/services/api";
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
    const [products, setProducts] = useState<(CompareProductDTO | null)[]>([
        null,
        null,
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const idsParam = params.get("ids");
        if (!idsParam) {
            setLoading(false);
            return;
        }

        const ids = idsParam.split(",").map(Number);
        if (ids.length !== 2) {
            message.warning("Bạn phải chọn đúng 2 sản phẩm để so sánh");
            setLoading(false);
            return;
        }

        compareProductsAPI(ids).then((res) => {
            const data = res.data || [];
            setProducts([data[0] || null, data[1] || null]);
            setLoading(false);
        });
    }, [params]);

    const handleRemove = (index: number) => {
        const newProducts = [...products];
        newProducts[index] = null;
        setProducts(newProducts);
    };

    const handleSelectSuggestion = async (productId: number, index: number) => {
        try {
            const res = await getProductDetailAPI(productId);
            const newProducts = [...products];
            newProducts[index] = res.data;
            setProducts(newProducts);
        } catch {
            message.error("Không lấy được chi tiết sản phẩm");
        }
    };

    if (loading) {
        return (
            <div className="compare-message">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    const data = [
        {
            key: "image",
            attribute: "Ảnh sản phẩm",
            productA: (
                <ProductCell
                    product={products[0]}
                    index={0}
                    handleRemove={handleRemove}
                    handleSelectSuggestion={handleSelectSuggestion}
                />
            ),
            productB: (
                <ProductCell
                    product={products[1]}
                    index={1}
                    handleRemove={handleRemove}
                    handleSelectSuggestion={handleSelectSuggestion}
                />
            ),
        },
        {
            key: "name",
            attribute: "Tên sản phẩm",
            productA: products[0] ? <strong>{products[0].name}</strong> : "-",
            productB: products[1] ? <strong>{products[1].name}</strong> : "-",
        },
        ...fields.map(({ key, label }) => {
            const valueA = products[0]?.[key] ?? "";
            const valueB = products[1]?.[key] ?? "";
            const isDifferent = valueA !== valueB && valueA && valueB;

            return {
                key,
                attribute: label,
                productA: (
                    <span className={isDifferent ? "diff-value" : ""}>
                        {valueA || "-"}
                    </span>
                ),
                productB: (
                    <span className={isDifferent ? "diff-value" : ""}>
                        {valueB || "-"}
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

type ProductCellProps = {
    product: CompareProductDTO | null;
    index: number;
    handleRemove: (i: number) => void;
    handleSelectSuggestion: (id: number, i: number) => void;
};

const ProductCell = ({
    product,
    index,
    handleRemove,
    handleSelectSuggestion,
}: ProductCellProps) => {
    const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

    const handleSearchSuggest = async (value: string) => {
        if (!value) return;
        const res = await getProductSuggestionsAPI(value);
        setOptions(
            res.data.map((p) => ({
                value: p.id,
                label: p.name,
            }))
        );
    };

    if (!product) {
        return (
            <AutoComplete
                style={{ width: 200 }}
                options={options}
                onSearch={handleSearchSuggest}
                onSelect={(val) => handleSelectSuggestion(Number(val), index)}
                placeholder="Tìm sản phẩm..."
            />
        );
    }

    return (
        <div style={{ position: "relative" }}>
            <img
                src={
                    product.image?.startsWith("http")
                        ? product.image
                        : `${import.meta.env.VITE_BACKEND_URL}/upload/products/${product.image}`
                }
                alt={product.name}
                style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                }}
            />
            <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleRemove(index)}
                style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    color: "red",
                }}
            />
        </div>
    );
};

export default CompareProductPage;
