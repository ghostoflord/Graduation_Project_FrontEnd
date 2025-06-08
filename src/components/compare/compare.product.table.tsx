import { useEffect, useState } from "react";
import { Table, Image, Spin } from "antd";
import { useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { compareProductsAPI } from "@/services/api";

interface SpecRow {
    key: string;
    label: string;
    [productId: string]: any;
}

const CompareProductTable = () => {
    const [params] = useSearchParams();
    const [data, setData] = useState<CompareProductDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const idsParam = params.get("ids");
        if (!idsParam) return;

        const ids = idsParam.split(",").map(Number);
        compareProductsAPI(ids).then((res) => {
            setData(res.data.data || []);
            setLoading(false);
        });
    }, [params]);

    const renderSpecRows = (): SpecRow[] => {
        const specs = [
            { key: "cpu", label: "CPU" },
            { key: "ram", label: "RAM" },
            { key: "storage", label: "Storage" },
            { key: "gpu", label: "GPU" },
            { key: "screen", label: "Screen" },
            { key: "battery", label: "Battery" },
            { key: "weight", label: "Weight" },
            { key: "material", label: "Material" },
            { key: "os", label: "OS" },
            { key: "specialFeatures", label: "Special Features" },
            { key: "ports", label: "Ports" },
        ];

        return specs.map((spec) => {
            const row: SpecRow = {
                key: spec.key,
                label: spec.label,
            };

            data.forEach((product) => {
                row[product.id] = product[spec.key as keyof CompareProductDTO];
            });

            return row;
        });
    };

    const columns: ColumnsType<SpecRow> = [
        {
            title: "Thông số",
            dataIndex: "label",
            key: "label",
            fixed: "left",
            width: 180,
        },
        ...data.map((product) => ({
            title: (
                <div style={{ textAlign: "center" }}>
                    <Image src={product.image} width={80} />
                    <div>{product.name}</div>
                </div>
            ),
            dataIndex: product.id.toString(),
            key: product.id.toString(),
            render: (text: string) => <span>{text}</span>,
        })),
    ];

    return (
        <div>
            <h2>So sánh sản phẩm</h2>
            {loading ? (
                <Spin />
            ) : (
                <Table
                    dataSource={renderSpecRows()}
                    columns={columns}
                    pagination={false}
                    bordered
                    rowKey="key"
                    scroll={{ x: true }}
                />
            )}
        </div>
    );
};

export default CompareProductTable;
