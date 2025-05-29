import { useEffect, useState } from 'react';
import { Button, Card, List, message, Result } from 'antd';
import { acceptOrderAPI, completeOrderAPI, getOrdersForShipperAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';

const ShipperOrderList = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { user } = useCurrentApp();

    const isShipper = user?.role === 'SHIPPER';

    const fetchOrders = async () => {
        try {
            const res = await getOrdersForShipperAPI();
            setOrders(res.data);
        } catch (err) {
            message.error('Không thể tải danh sách đơn hàng.');
        }
    };

    const handleAccept = async (orderId: number) => {
        try {
            await acceptOrderAPI(orderId);
            message.success('Nhận đơn thành công');
            fetchOrders();
        } catch (err) {
            message.error('Nhận đơn thất bại');
        }
    };

    const handleComplete = async (orderId: number) => {
        try {
            await completeOrderAPI(orderId);
            message.success('Hoàn tất đơn hàng');
            fetchOrders();
        } catch (err) {
            message.error('Thất bại khi hoàn tất đơn hàng');
        }
    };

    useEffect(() => {
        if (isShipper) {
            fetchOrders();
        }
    }, [isShipper]);

    if (!isShipper) {
        return (
            <Result
                status="403"
                title="403 - Forbidden"
                subTitle="Bạn không có quyền truy cập vào trang này"
                extra={<Button type="primary" onClick={() => navigate('/')}>Về trang chủ</Button>}
            />
        );
    }

    return (
        <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={orders}
            renderItem={(order: any) => (
                <List.Item>
                    <Card title={`Mã đơn: ${order.code}`}>
                        <p>Người nhận: {order.receiverName}</p>
                        <p>Địa chỉ: {order.address}</p>
                        <p>Trạng thái: {order.status}</p>
                        {order.status === 'PENDING' && (
                            <Button type="primary" onClick={() => handleAccept(order.id)}>
                                Nhận đơn
                            </Button>
                        )}
                        {order.status === 'DELIVERING' && (
                            <Button danger onClick={() => handleComplete(order.id)}>
                                Hoàn tất
                            </Button>
                        )}
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default ShipperOrderList;
