import React, { useRef } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { fetchAllOrders } from '@/services/api';


const TableOrder = () => {
    const actionRef = useRef<ActionType>();

    const handleExport = async () => {
        try {
            const orders = await fetchAllOrders();

            const csvHeader = 'ID,Receiver Name,Receiver Address,Receiver Phone,Total Price,Status,User ID\n';
            const csvRows = orders.map(order =>
                `${order.id},"${order.receiverName}","${order.receiverAddress}","${order.receiverPhone}",${order.totalPrice},"${order.status}",${order.userId}`
            );
            const csvContent = csvHeader + csvRows.join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orders.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const columns: ProColumns<IOrderTable>[] = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Receiver Name', dataIndex: 'receiverName' },
        { title: 'Receiver Address', dataIndex: 'receiverAddress' },
        { title: 'Receiver Phone', dataIndex: 'receiverPhone' },
        {
            title: 'Tổng Số Lượng',
            dataIndex: 'totalPrice',
            render: (_, record) => record.totalPrice.toLocaleString('vi-VN'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
                PENDING: { text: 'Pending' },
                PROCESSING: { text: 'Processing' },
                DELIVERED: { text: 'Delivered' },
                CANCELLED: { text: 'Cancelled' },
            },
        },
        { title: 'User ID', dataIndex: 'userId' },
    ];

    return (
        <ProTable<IOrderTable>
            headerTitle="Order List"
            actionRef={actionRef}
            columns={columns}
            request={async () => {
                const data = await fetchAllOrders();
                return { data, success: true };
            }}
            rowKey="id"
            search={false}
            toolBarRender={() => [
                <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>
                    Export CSV
                </Button>,
            ]}
        />
    );
};

export default TableOrder;
