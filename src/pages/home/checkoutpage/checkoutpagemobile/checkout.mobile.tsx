import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Divider, message } from "antd";
import {
    getCart,
    checkoutOrder,
    placeOrderAPI,
    createVNPayURL
} from "@/services/api";
import { useNavigate } from "react-router-dom";
import "./checkout.mobile.scss";

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

const CheckoutMobile: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
    const navigate = useNavigate();

    useEffect(() => {
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
            setPhone(user.phone || '');
            setAddress(user.address || '');

            getCart(uid).then(cartRes => {
                if (cartRes?.data?.items) {
                    const merged = mergeDuplicateItems(cartRes.data.items);
                    setCartItems(merged);
                    const total = merged.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    setTotalPrice(total);
                }
            });
        } catch (err) {
            console.error("Lỗi parse user:", err);
            message.error("Dữ liệu người dùng lỗi");
        }
    }, []);

    const handlePlaceOrder = async () => {
        if (!userId) return message.error("Thiếu thông tin người dùng");

        const itemsToCheckout = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
        }));

        const orderPayload = {
            userId,
            name,
            address,
            phone,
            items: itemsToCheckout,
        };

        try {
            if (paymentMethod === 'cod') {
                const res = await placeOrderAPI(orderPayload);
                if (res?.statusCode === 201) {
                    await checkoutOrder(itemsToCheckout);
                    message.success(" Đặt hàng thành công!");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                } else {
                    message.error(res?.message || "Đặt hàng thất bại");
                }
            } else if (paymentMethod === 'vnpay') {
                const paymentRef = `ORDER_${Date.now()}`;
                const res = await createVNPayURL({
                    ...orderPayload,
                    amount: totalPrice,
                    paymentRef,
                });

                if (res?.data) {
                    window.location.href = res.data;
                } else {
                    message.error("Không thể tạo URL thanh toán");
                }
            }
        } catch (err) {
            console.error("Checkout error:", err);
            message.error("Lỗi khi đặt hàng");
        }
    };

    return (
        <div className="checkout-mobile">
            <div className="checkout-header">
                <Title level={3}>LAPTOPNEW</Title>
            </div>

            <div className="checkout-section">
                <div className="checkout-summary">
                    <Text strong>Đơn hàng ({cartItems.length} sản phẩm)</Text>
                    <Text className="price">{totalPrice.toLocaleString("vi-VN")}₫</Text>
                </div>

                <div className="checkout-product-list">
                    {cartItems.map(item => (
                        <div key={item.productId} className="checkout-product">
                            <div className="checkout-product-header">
                                <Text strong>{item.name}</Text>
                                <Text type="secondary" style={{ marginLeft: 8 }}>
                                    x{item.quantity} - {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                </Text>
                            </div>

                            <div className="checkout-product-details">
                                <div className="image-wrapper">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`}
                                        alt={item.name}
                                        className="product-image"
                                    />
                                </div>
                                <Text type="secondary">{item.shortDescription}</Text>
                                <br />
                                <Text>{item.detailDescription}</Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Divider />

            <div className="checkout-section">
                <div className="checkout-info-header">
                    <Text strong>Thông tin nhận hàng</Text>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            localStorage.removeItem("user");
                            message.success("Đăng xuất thành công");
                            navigate("/login");
                        }}
                    >
                        Đăng xuất
                    </Button>
                </div>

                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Họ và tên" className="mb-2" />
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Số điện thoại" className="mb-2" />
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ" className="mb-2" />

                <div className="payment-method-mobile">
                    <Text strong>Phương thức thanh toán</Text>
                    <div className="method-options">
                        <Button
                            type={paymentMethod === 'cod' ? 'primary' : 'default'}
                            onClick={() => setPaymentMethod('cod')}
                            className="method-btn"
                        >
                            COD
                        </Button>
                        <Button
                            type={paymentMethod === 'vnpay' ? 'primary' : 'default'}
                            onClick={() => setPaymentMethod('vnpay')}
                            className="method-btn"
                        >
                            VNPAY
                        </Button>
                    </div>
                </div>

                <Button type="primary" block onClick={handlePlaceOrder}>
                    {paymentMethod === 'cod' ? 'Đặt hàng' : 'Thanh toán VNPAY'}
                </Button>

                <Button type="link" block onClick={() => window.location.href = "/"}>
                    ← Quay về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default CheckoutMobile;
