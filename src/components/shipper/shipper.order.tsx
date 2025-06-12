import { useEffect, useState } from "react";
import { Button, Card, Spin, message, Pagination } from "antd";
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

const statusLabels: Record<string, string> = {
    pending: "PENDING",
    delivered: "SHIPPING",
    history: "DELIVERED",
};

const ShipperOrderPage = ({ selectedTab }: { selectedTab: string }) => {
    const [orders, setOrders] = useState<IOrderTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const fetchOrders = async (page = current, size = pageSize) => {
        try {
            setLoading(true);
            const status = statusLabels[selectedTab];
            const query = `current=${page}&pageSize=${size}&status=${status}`;
            const res = await getOrdersForShipperAPI(query);

            setOrders(res.data.result ?? []);
            setTotal(res.data.meta?.total ?? 0);
        } catch (err) {
            message.error("Lỗi khi tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1); // load lại từ đầu khi tab đổi
        setCurrent(1);
    }, [selectedTab]);

    const handleDelivered = async (orderId: number) => {
        try {
            setProcessingId(orderId);
            await markOrderAsDeliveredAPI(orderId);
            message.success("Đã chuyển trạng thái đơn hàng sang 'Đã giao'");
            fetchOrders(); // giữ nguyên current, pageSize
        } catch (err) {
            message.error("Không thể cập nhật trạng thái đơn hàng");
        } finally {
            setProcessingId(null);
        }
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrent(page);
        setPageSize(size || pageSize);
        fetchOrders(page, size || pageSize);
    };

    return (
        <Spin spinning={loading}>
            {orders.length === 0 ? (
                <p>Không có đơn hàng nào.</p>
            ) : (
                <>
                    {orders.map((order) => (
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
                    ))}

                    <Pagination
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        showSizeChanger
                        onChange={handlePageChange}
                        style={{ marginTop: 16, textAlign: "center" }}
                    />
                </>
            )}
        </Spin>
    );
};

export default ShipperOrderPage;
