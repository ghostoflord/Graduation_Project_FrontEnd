import React, { useEffect, useState } from 'react';
import './checkout.page.scss';
import { Input, Button, Radio, Row, Col, Typography, Card, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    checkoutOrder,
    getCart,
    placeOrderAPI,
    createVNPayURL
} from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';

const { Title, Text } = Typography;

interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    detailDescription: string;
    shortDescription: string;
}

const mergeDuplicateItems = (items: CartItem[]): CartItem[] => {
    const map = new Map<number, CartItem>();
    items.forEach(item => {
        if (map.has(item.productId)) {
            const existing = map.get(item.productId)!;
            map.set(item.productId, {
                ...existing,
                quantity: existing.quantity + item.quantity
            });
        } else {
            map.set(item.productId, { ...item });
        }
    });
    return Array.from(map.values());
};

const CheckoutPage = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>('cod');
    const navigate = useNavigate();
    const { setCartSummary } = useCurrentApp();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            message.error('Không tìm thấy thông tin người dùng');
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            const uid = Number(user.id);
            setUserId(uid);
            setName(user.name || '');
            setAddress(user.address || '');
            setPhone(user.phone || '');

            getCart(uid)
                .then(cartRes => {
                    if (cartRes?.data?.items) {
                        const rawItems: CartItem[] = cartRes.data.items;
                        const mergedItems = mergeDuplicateItems(rawItems);
                        setCartItems(mergedItems);
                        const total = mergedItems.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                        );
                        setTotalPrice(total);
                    } else {
                        message.warning('Giỏ hàng trống');
                    }
                })
                .catch(err => {
                    console.error('Lỗi khi lấy giỏ hàng:', err);
                    message.error('Không thể lấy giỏ hàng');
                });
        } catch (e) {
            console.error('Lỗi khi phân tích user từ localStorage:', e);
            message.error('Dữ liệu người dùng không hợp lệ');
        }
    }, []);

    const handlePlaceOrder = async () => {
        if (!userId) return message.error('Thiếu thông tin người dùng');

        const itemsToCheckout = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        const orderPayload = { userId, name, address, phone, items: itemsToCheckout };

        if (paymentMethod === 'cod') {
            try {
                const res = await placeOrderAPI(orderPayload);
                if (res?.statusCode === 201) {
                    await checkoutOrder(itemsToCheckout);
                    message.success('Đặt hàng thành công!');
                    setCartSummary({ sum: 0 }); // Cập nhật cart ở Header
                    setTimeout(() => navigate('/'), 1000);
                } else {
                    message.error(res?.message || 'Đặt hàng thất bại');
                }
            } catch (err) {
                console.error(err);
                message.error('Lỗi khi xử lý đơn hàng');
            }
        } else if (paymentMethod === 'vnpay') {
            try {
                const paymentRef = `ORDER_${Date.now()}`;
                const res = await createVNPayURL({
                    ...orderPayload,
                    amount: totalPrice,
                    paymentRef
                });
                if (res?.data) {
                    window.location.href = res.data;
                } else {
                    message.error('Không thể tạo URL thanh toán');
                }
            } catch (err) {
                console.error(err);
                message.error('Lỗi khi tạo thanh toán VNPAY');
            }
        }
    };

    return (
        <div className="checkout-container">
            <Row gutter={32}>
                <Col span={14} className="checkout-left">
                    <Title level={4}>Thông tin nhận hàng</Title>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Họ và tên"
                        className="mb-3"
                    />
                    <Input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Số điện thoại"
                        className="mb-3"
                    />
                    <Input
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Địa chỉ"
                        className="mb-3"
                    />

                    <Title level={4}>Thanh toán</Title>
                    <Radio.Group
                        className="payment-methods"
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                    >
                        <Radio.Button value="vnpay">Thanh toán qua VNPAY</Radio.Button>
                        <Radio.Button value="cod">
                            Thanh toán khi giao hàng (COD)
                        </Radio.Button>
                    </Radio.Group>
                </Col>

                <Col span={10} className="checkout-right">
                    <Card className="order-summary">
                        <Title level={5}>Đơn hàng</Title>
                        {cartItems.length === 0 ? (
                            <Text type="secondary">
                                Không có sản phẩm trong giỏ hàng
                            </Text>
                        ) : (
                            <>
                                {cartItems.map(item => (
                                    <div className="product-row" key={item.productId}>
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`}
                                            alt={item.name}
                                            className="product-image"
                                        />
                                        <div className="product-info">
                                            <Text strong>{item.name}</Text>
                                            <div>{item.shortDescription}</div>
                                            <div>{item.detailDescription}</div>
                                            <div>Số lượng: {item.quantity}</div>
                                        </div>
                                        <Text className="product-price">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                        </Text>
                                    </div>
                                ))}
                                <Divider />
                                <div className="summary-total">
                                    <Text strong>Tổng cộng</Text>
                                    <Text strong className="total-amount">
                                        {totalPrice.toLocaleString('vi-VN')}₫
                                    </Text>
                                </div>
                            </>
                        )}
                        <Button
                            type="primary"
                            block
                            size="large"
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={cartItems.length === 0}
                        >
                            {paymentMethod === 'cod'
                                ? 'ĐẶT HÀNG'
                                : 'THANH TOÁN VNPAY'}
                        </Button>
                        <Button type="link" block onClick={() => navigate('/')}>
                            ← Quay về trang chủ
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
