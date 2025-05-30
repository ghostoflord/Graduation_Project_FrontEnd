import { useEffect, useState } from "react";
import { Button, Card, Spin, message } from "antd";
import { getOrdersForShipperAPI, markOrderAsDeliveredAPI } from "@/services/api";

interface IOrderTable {
    id: number;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    status: string;
    createdAt: string;
    totalPrice: number;
    totalQuantity: number;
}

type GroupedOrders = Record<string, IOrderTable[]>;

const statusLabels: Record<string, string> = {
    pending: "PENDING",
    delivered: "SHIPPING",
    history: "DELIVERED",
};

const groupOrdersByStatus = (orders: IOrderTable[]): GroupedOrders => {
    return orders.reduce((acc: GroupedOrders, order) => {
        const key = order.status;
        if (!acc[key]) acc[key] = [];
        acc[key].push(order);
        return acc;
    }, {});
};

const ShipperOrderPage = ({ selectedTab }: { selectedTab: string }) => {
    const [groupedOrders, setGroupedOrders] = useState<GroupedOrders>({});
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null); // để disable nút tạm thời

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getOrdersForShipperAPI();
            console.log("RES >>> ", res.data);
            const allOrders: IOrderTable[] = res.data;
            setGroupedOrders(groupOrdersByStatus(allOrders));
        } catch (err) {
            message.error("Lỗi khi tải đơn hàng của bạn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelivered = async (orderId: number) => {
        try {
            setProcessingId(orderId);
            await markOrderAsDeliveredAPI(orderId);
            message.success("Đã chuyển trạng thái đơn hàng sang 'Đã giao'");
            fetchOrders();
        } catch (err) {
            message.error("Không thể cập nhật trạng thái đơn hàng");
        } finally {
            setProcessingId(null);
        }
    };

    const currentStatus = statusLabels[selectedTab];
    const ordersToShow = groupedOrders[currentStatus] || [];

    return (
        <Spin spinning={loading}>
            {ordersToShow.length === 0 ? (
                <p>Không có đơn hàng nào.</p>
            ) : (
                ordersToShow.map((order) => (
                    <Card key={order.id} title={`Mã đơn: ${order.id}`}>
                        <p>Người nhận: {order.receiverName}</p>
                        <p>SĐT: {order.receiverPhone}</p>
                        <p>Địa chỉ: {order.receiverAddress}</p>
                        <p>Số lượng: {order.totalQuantity}</p>
                        <p>Tổng tiền: {order.totalPrice.toLocaleString()}đ</p>

                        {order.status === "SHIPPING" && (
                            <Button
                                type="primary"
                                onClick={() => handleDelivered(order.id)}
                                loading={processingId === order.id}
                            >
                                Đã giao xong
                            </Button>
                        )}
                    </Card>
                ))
            )}
        </Spin>
    );
};

export default ShipperOrderPage;
