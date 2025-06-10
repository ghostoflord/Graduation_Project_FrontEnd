import React, { useState } from "react";
import { Modal, Button } from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { getLowStockProductsAPI } from "@/services/api";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";

interface LowStockModalProps {
    open: boolean;
    onClose: () => void;
}

const LowStockModal: React.FC<LowStockModalProps> = ({ open, onClose }) => {
    const [currentDataTable, setCurrentDataTable] = useState<IProductTable[]>([]);

    const columns: ProColumns<IProductTable>[] = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
        },
        {
            title: "SKU",
            dataIndex: "sku",
        },
        {
            title: "Tồn kho",
            dataIndex: "quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
            valueType: "money",
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title="Sản phẩm sắp hết hàng"
            width={800}
        >
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <CSVLink
                    data={currentDataTable}
                    filename="export-low-stock.csv"
                >
                    <Button icon={<ExportOutlined />} type="primary">
                        Export
                    </Button>
                </CSVLink>
            </div>

            <ProTable<IProductTable>
                rowKey="id"
                columns={columns}
                search={{
                    labelWidth: "auto",
                }}
                options={false}
                pagination={{
                    pageSize: 5,
                }}
                request={async (params) => {
                    const res = await getLowStockProductsAPI();
                    if (res?.data) {
                        const filtered = res.data.filter((item: IProductTable) => {
                            if (params.name && !item.name?.toLowerCase().includes(params.name.toLowerCase())) return false;
                            if (params.sku && !item.sku?.toLowerCase().includes(params.sku.toLowerCase())) return false;
                            return true;
                        });

                        setCurrentDataTable(filtered);
                        return {
                            data: filtered,
                            success: true,
                        };
                    }
                    return {
                        data: [],
                        success: false,
                    };
                }}
            />
        </Modal>
    );
};

export default LowStockModal;
