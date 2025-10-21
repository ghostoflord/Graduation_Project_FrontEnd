import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Button, message, Popconfirm, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import axios from '@/services/axios.customize';
import { fetchMyOrders } from '@/services/api';
import './order.history.mobile.scss';

interface OrderSummary {
    id: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    receiverName: string;
    receiverPhone: string;
    totalQuantity: number;
}

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

const OrderHistoryMobile = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

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

    const renderActions = (order: OrderSummary) => {
        if (order.status === 'PENDING') {
            return (
                <Popconfirm
                    title="Xác nhận hủy đơn hàng?"
                    onConfirm={() => handleCancelOrder(order.id)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Button danger className="small-button">
                        Hủy đơn
                    </Button>
                </Popconfirm>
            );
        }

        if (order.status === 'CONFIRMED') {
            return (
                <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button type="primary" className="small-button">
                        Lấy Hóa Đơn
                    </Button>
                </a>
            );
        }

        return null;
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="order-history-container">
            <div className="order-history-header">
                <Link to="/">
                    <Button type="default" className="small-button">
                        ← Quay về trang chủ
                    </Button>
                </Link>
            </div>

            <List
                loading={loading}
                dataSource={paginatedOrders}
                renderItem={(order) => (
                    <Card
                        className="order-card"
                        title={`Mã đơn hàng: ${order.id}`}
                        extra={renderStatus(order.status)}
                    >
                        <p><strong>Người nhận:</strong> {order.receiverName}</p>
                        <p><strong>SĐT:</strong> {order.receiverPhone}</p>
                        <p><strong>Số lượng SP:</strong> {order.totalQuantity.toLocaleString()}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <div className="order-actions">{renderActions(order)}</div>
                    </Card>
                )}
            />

            <Pagination
                className="order-pagination"
                current={currentPage}
                pageSize={pageSize}
                total={orders.length}
                onChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default OrderHistoryMobile;
