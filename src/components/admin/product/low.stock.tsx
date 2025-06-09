import React, { useState } from "react";
import { Modal, Button } from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { getLowStockProductsAPI } from "@/services/api";

interface LowStockModalProps {
    open: boolean;
    onClose: () => void;
}

const LowStockModal: React.FC<LowStockModalProps> = ({ open, onClose }) => {
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
            <ProTable<IProductTable>
                rowKey="id"
                columns={columns}
                search={false}
                options={false}
                pagination={{
                    pageSize: 5,
                }}
                request={async () => {
                    const res = await getLowStockProductsAPI();
                    if (res?.data) {
                        return {
                            data: res.data,
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
