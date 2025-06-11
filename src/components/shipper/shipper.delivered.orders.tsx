import React, { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getDeliveredOrders } from '@/services/api';

interface IOrderTable {
    id: number;
    totalPrice: number;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentRef: string;
    shippingMethod: string;
    trackingCode: string;
    estimatedDeliveryTime: string;
    createdAt: string;
    updatedAt: string;
    deliveredAt: string;
    cancelReason: string | null;
    customerName: string | null;
    customerEmail: string | null;
}

const ShipperDeliveredOrders = () => {
    const [orders, setOrders] = useState<IOrderTable[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    const fetchDeliveredOrders = async () => {
        setLoading(true);
        try {
            const res = await getDeliveredOrders();
            if (res.statusCode === 200) {
                setOrders(res.data);
            } else {
                message.error('Không thể tải danh sách đơn hàng đã giao');
            }
        } catch (err) {
            console.error(err);
            message.error('Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<IOrderTable> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Người nhận',
            dataIndex: 'receiverName',
            key: 'receiverName',
        },
        {
            title: 'Điện thoại',
            dataIndex: 'receiverPhone',
            key: 'receiverPhone',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'receiverAddress',
            key: 'receiverAddress',
        },
        {
            title: 'Tổng SL',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (value) => `${value.toLocaleString()} đ`,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = '';

                switch (status) {
                    case 'DELIVERED':
                        color = 'green';
                        text = 'Đã giao hàng thành công';
                        break;
                    case 'CANCELLED':
                        color = 'red';
                        text = 'Đã hủy';
                        break;
                    case 'PENDING':
                        color = 'orange';
                        text = 'Đang xử lý';
                        break;
                    default:
                        text = status;
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },

    ];

    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>Lịch sử đơn hàng đã giao</h2>
            <Table
                rowKey="id"
                loading={loading}
                dataSource={orders}
                columns={columns}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ShipperDeliveredOrders;
