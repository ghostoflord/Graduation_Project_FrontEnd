import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './order.qr.view.scss';
import { fetchOrderSummaryById } from '@/services/api';

const InvoiceView = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<IOrderTable | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        fetchOrderSummaryById(id)
            .then(data => setOrder(data))
            .catch(err => console.error('Error fetching order:', err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="invoice-view">Đang tải hóa đơn...</div>;
    }

    if (!order) {
        return <div className="invoice-view">Không tìm thấy đơn hàng.</div>;
    }

    return (
        <div className="invoice-view">
            <h1>HÓA ĐƠN THANH TOÁN</h1>
            <div className="invoice-content">
                <p><strong>Mã đơn hàng:</strong> {order.id}</p>
                <p><strong>Khách hàng:</strong> {order.receiverName}</p>
                <p><strong>Địa chỉ:</strong> {order.receiverAddress}</p>
                <p><strong>Số điện thoại:</strong> {order.receiverPhone}</p>
                <p><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}đ</p>
            </div>
            <footer>
                <p>Cảm ơn quý khách đã mua hàng!</p>
            </footer>
        </div>
    );
};

export default InvoiceView;
