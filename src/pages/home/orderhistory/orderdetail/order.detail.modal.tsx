import React from 'react';
import { Modal, Table, Descriptions, Tag } from 'antd';

interface OrderItem {
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
}

interface OrderHistory {
    orderId: number;
    totalPrice: number;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    trackingCode: string;
    createdAt: string;
    deliveredAt: string;
    items: OrderItem[];
}

interface Props {
    visible: boolean;
    onClose: () => void;
    order: OrderHistory | null;
}

function OrderDetailModal({ visible, onClose, order }: Props) {
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'productImage',
            render: (img: string) => {
                const avatarUrl = img?.startsWith('http')
                    ? img
                    : `${import.meta.env.VITE_BACKEND_URL}/upload/products/${img}`;
                return avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="product"
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                ) : (
                    <span>No image</span>
                );
            },
        },

        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (price: number) => `${price.toLocaleString()}₫`,
        },
    ];

    return (
        <Modal open={visible} onCancel={onClose} footer={null} width={800} title={`Chi tiết đơn hàng #${order?.orderId}`}>
            {order && (
                <>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Người nhận">{order.receiverName}</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">{order.receiverAddress}</Descriptions.Item>
                        <Descriptions.Item label="SĐT">{order.receiverPhone}</Descriptions.Item>
                        <Descriptions.Item label="Tổng sản phẩm">{order.totalPrice.toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color="blue">{order.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thanh toán">{order.paymentMethod}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái thanh toán">{order.paymentStatus}</Descriptions.Item>
                        <Descriptions.Item label="Mã vận đơn">{order.trackingCode || 'Chưa có'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Không có'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày giao hàng">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Chưa giao'}</Descriptions.Item>
                    </Descriptions>
                    <Table
                        dataSource={order.items}
                        columns={columns}
                        rowKey="productId"
                        style={{ marginTop: 20 }}
                        pagination={false}
                    />
                </>
            )}
        </Modal>
    );
}

export default OrderDetailModal;
