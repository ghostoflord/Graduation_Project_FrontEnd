import React, { useEffect, useState } from 'react';
import { Typography, Button, InputNumber, Card, Row, Col, message, Empty, Spin, } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getCart, removeCartItemAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import './cart.mobile.scss';
import CartBreadcrumb from '@/pages/productbreadcrumb/cartbreadcrumb/cart.bread.crumb';

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
                quantity: existing.quantity + item.quantity,
            });
        } else {
            map.set(item.productId, { ...item });
        }
    });
    return Array.from(map.values());
};

const CartMobile = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchCart = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        if (!userId) {
            message.warning('Bạn chưa đăng nhập');
            setLoading(false);
            return;
        }

        getCart(userId)
            .then(res => {
                const rawItems: CartItem[] = res.data.items;
                const merged = mergeDuplicateItems(rawItems);
                updateCartState(merged);
            })
            .catch(err => {
                console.error('Lỗi lấy giỏ hàng:', err);
                message.error('Không thể tải giỏ hàng');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const updateCartState = (items: CartItem[]) => {
        setCartItems(items);
        setTotalPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        const updated = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        );
        updateCartState(updated);
    };

    const removeItem = async (productId: number) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        if (!userId) return;

        try {
            await removeCartItemAPI(userId, productId);
            const updated = cartItems.filter(item => item.productId !== productId);
            updateCartState(updated);
            message.success('Đã xoá sản phẩm');
        } catch (err) {
            message.error('Lỗi khi xoá sản phẩm');
        }
    };

    const handleCheckout = () => {
        navigate('/thanh-toan');
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return <Spin style={{ display: 'block', margin: 'auto' }} />;
    }

    return (
        <div className="cart-mobile-container">
            <CartBreadcrumb />
            <Title level={4} className="text-center">Giỏ Hàng</Title>
            {cartItems.length === 0 ? (
                <div className="empty-container">
                    <Empty description="Giỏ hàng trống" />
                    <Button type="primary" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>
                </div>
            ) : (
                <>
                    {cartItems.map(item => (
                        <Card key={item.productId} className="cart-mobile-item mb-3">
                            <div className="cart-mobile-item-wrapper">
                                <div className="cart-mobile-image-container">
                                    <img
                                        src={
                                            item.image
                                                ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`
                                                : '/default-product.jpg'
                                        }
                                        alt={item.name}
                                        className="cart-mobile-image"
                                    />
                                </div>
                                <div className="cart-mobile-info">
                                    <Text strong>Tên sản phẩm: {item.name}</Text>
                                    <div>Miêu tả ngắn: {item.shortDescription}</div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Chi tiết sản phẩm: {item.detailDescription}
                                        </Text>
                                    </div>
                                    <div className="cart-mobile-bottom-row">
                                        <Text strong>
                                            Giá: {item.price.toLocaleString('vi-VN')} ₫
                                        </Text>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <InputNumber
                                                min={1}
                                                value={item.quantity}
                                                onChange={(val) => updateQuantity(item.productId, val || 1)}
                                                size="small"
                                            />
                                            <Button
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeItem(item.productId)}
                                            >
                                                Xoá
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Card>
                    ))}

                    <div className="checkout-footer">
                        <Title level={5} className="total-price">
                            Tổng tiền: {totalPrice.toLocaleString('vi-VN')} ₫
                        </Title>
                        <Button
                            size="large"
                            onClick={handleCheckout}
                            className="checkout-btn"
                        >
                            Thanh toán
                        </Button>
                    </div>

                </>
            )}
        </div>
    );
};

export default CartMobile;
