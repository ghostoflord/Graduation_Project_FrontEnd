import React, { useEffect, useState } from 'react';
import './checkout.page.scss';
import { Input, Button, Radio, Row, Col, Typography, Card, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCart, placeOrderAPI } from '@/services/api';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy user từ localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            message.error("Không tìm thấy thông tin người dùng");
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            const uid = Number(user.id);
            setUserId(uid);
            setName(user.name || '');
            setAddress(user.address || '');
            setPhone(user.phone || '');

            // Lấy giỏ hàng
            getCart(uid).then(cartRes => {
                console.log("Giỏ hàng trả về:", cartRes?.data);
                if (cartRes?.data?.items) {
                    const items = cartRes.data.items;
                    setCartItems(items);
                    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    setTotalPrice(total);
                } else {
                    message.warning("Giỏ hàng trống");
                }
            }).catch(err => {
                console.error("Lỗi khi lấy giỏ hàng:", err);
                message.error("Không thể lấy giỏ hàng");
            });
        } catch (e) {
            console.error("Lỗi khi phân tích user từ localStorage:", e);
            message.error("Dữ liệu người dùng không hợp lệ");
        }
    }, []);

    const handlePlaceOrder = async () => {
        if (!userId) return message.error("Thiếu thông tin người dùng");
        try {
            const res = await placeOrderAPI({ userId, name, address, phone });
            if (res?.statusCode === 201) {
                message.success("Đặt hàng thành công!");
                setTimeout(() => navigate("/"), 1000); // Đợi 1s để hiển thị message
            } else {
                message.error(res?.message || "Đặt hàng thất bại");
            }
        } catch (err) {
            console.error(err);
            message.error("Lỗi server khi đặt hàng");
        }
    };


    return (
        <div className="checkout-container">
            <Row gutter={32}>
                <Col span={14} className="checkout-left">
                    <Title level={4}>Thông tin nhận hàng</Title>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Họ và tên" className="mb-3" />
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Số điện thoại" className="mb-3" />
                    <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ" className="mb-3" />
                    <Title level={4}>Thanh toán</Title>
                    <Radio.Group className="payment-methods">
                        <Radio.Button value="bank">Chuyển khoản qua ngân hàng</Radio.Button>
                        <Radio.Button value="cod">Thanh toán khi giao hàng (COD)</Radio.Button>
                    </Radio.Group>
                </Col>

                <Col span={10} className="checkout-right">
                    <Card className="order-summary">
                        <Title level={5}>Đơn hàng</Title>
                        {cartItems.length === 0 ? (
                            <Text type="secondary">Không có sản phẩm trong giỏ hàng</Text>
                        ) : (
                            <>
                                {cartItems.map(item => (
                                    <div className="product-row" key={item.productId}>
                                        <img src={item.image} alt={item.name} />
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
                                    <Text strong className="total-amount">{totalPrice.toLocaleString('vi-VN')}₫</Text>
                                </div>
                            </>
                        )}
                        <Button type="primary" block size="large" className="place-order-btn" onClick={handlePlaceOrder}>
                            ĐẶT HÀNG
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
