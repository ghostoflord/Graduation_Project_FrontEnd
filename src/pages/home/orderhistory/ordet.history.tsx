import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Tag, Typography } from 'antd';
import axios from '@/services/axios.customize';
import { fetchMyOrders, fetchOrderDetails } from '@/services/api';
import OrderDetailModal from './orderdetail/order.detail.modal';
import './order.history.scss';
import AccountBreadcrumb from '@/pages/productbreadcrumb/accountbreadcrumb/account.bread.crumb';

const { Title } = Typography;

interface OrderSummary {
    id: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    receiverName: string;
    receiverPhone: string;
    totalQuantity: number;
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrderTable | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchMyOrders();
            setOrders(data);
        } catch (err) {
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            await axios.post(`/api/v1/orders/${orderId}/cancel`);
            message.success('Đơn hàng đã được hủy');
            fetchOrders();
        } catch (err: any) {
            if (err.response?.data?.message) {
                message.error(err.response.data.message);
            } else {
                message.error('Không thể hủy đơn hàng');
            }
        }
    };

    const handleViewOrderDetails = async (orderId: number) => {
        try {
            const data = await fetchOrderDetails(orderId);
            setSelectedOrder(data);
            setModalVisible(true);
        } catch {
            message.error('Không thể tải chi tiết đơn hàng');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const renderStatus = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Tag color="orange">Chờ xác nhận</Tag>;
            case 'CONFIRMED':
                return <Tag color="green">Đã nhận hàng</Tag>;
            case 'CANCELED':
                return <Tag color="red">Đã hủy</Tag>;
            case 'SHIPPED':
                return <Tag color="cyan">Đang giao</Tag>;
            case 'DELIVERED':
                return <Tag color="blue">Đã giao</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            render: (id: number) => (
                <Button type="link" onClick={() => handleViewOrderDetails(id)}>
                    {id}
                </Button>
            ),
        },
        {
            title: 'Tên người nhận',
            dataIndex: 'receiverName',
        },
        {
            title: 'SĐT',
            dataIndex: 'receiverPhone',
        },
        {
            title: 'Tổng Sản Phẩm',
            dataIndex: 'totalQuantity',
            render: (totalQuantity: number) => `${totalQuantity.toLocaleString()}`,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: renderStatus,
        },
        {
            title: 'Hành động',
            render: (_: any, record: OrderSummary) => {
                if (record.status === 'PENDING') {
                    return (
                        <Popconfirm
                            title="Xác nhận hủy đơn hàng?"
                            onConfirm={() => handleCancelOrder(record.id)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button danger>Hủy đơn</Button>
                        </Popconfirm>
                    );
                }

                if (record.status === 'CONFIRMED') {
                    return (
                        <a
                            href={`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/${record.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button type="primary">Lấy Hóa Đơn</Button>
                        </a>
                    );
                }

                return null;
            },
        },
    ];

    return (
        <div className="order-history-container">
            <AccountBreadcrumb />
            <Title level={2} className="order-history-title">
                Lịch sử mua hàng
            </Title>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={orders}
                pagination={{ pageSize: 5 }}
                className="order-history-table"
            />

            <OrderDetailModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default OrderHistory;
