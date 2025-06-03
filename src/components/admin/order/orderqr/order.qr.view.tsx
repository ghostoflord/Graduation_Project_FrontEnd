import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './order.qr.view.scss';

interface Order {
    id: number;
    receiverName: string;
    totalPrice: number;
    receiverAddress: string;
    receiverPhone: string;
    // Có thể mở rộng thêm trường ở đây
}

const InvoiceView = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        axios.get(`/api/v1/orders/${id}/detail`)
            .then(res => setOrder(res.data))
            .catch(err => console.error('Error fetching order:', err));
    }, [id]);

    if (!order) {
        return <div className="invoice-view">Đang tải hóa đơn...</div>;
    }

    return (
        <div className="invoice-view">
            <h1>HÓA ĐƠN THANH TOÁN</h1>
            <div className="invoice-content">
                <p><strong>Mã đơn hàng:</strong> {order.id}</p>
                <p><strong>Khách hàng:</strong> {order.receiverName}</p>
                <p><strong>Địa chỉ:</strong> {order.receiverAddress}</p>
                <p><strong>Số điện thoại:</strong> {order.receiverPhone}</p>
                <p><strong>Tổng tiền:</strong> {order.totalPrice ? order.totalPrice.toLocaleString() + 'đ' : 'N/A'}</p>

            </div>
            <footer>
                <p>Cảm ơn bạn đã mua hàng!</p>
            </footer>
        </div>
    );
};

export default InvoiceView;
