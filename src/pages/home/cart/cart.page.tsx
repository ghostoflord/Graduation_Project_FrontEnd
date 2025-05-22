import { Card, Button, InputNumber, List, Typography, Row, Col, message, Empty, } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { clearCartAPI, getCart, removeCartItemAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
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
                quantity: existing.quantity + item.quantity,
            });
        } else {
            map.set(item.productId, { ...item });
        }
    });
    return Array.from(map.values());
};

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const navigate = useNavigate();
    const { setCartSummary } = useCurrentApp();  // Lấy hàm setCartSummary từ context

    const handleCheckout = () => {
        navigate('/thanh-toan');
    };

    const fetchCart = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;

        if (!userId) {
            console.warn('Không tìm thấy userId');
            return;
        }

        getCart(userId)
            .then(res => {
                const rawItems: CartItem[] = res.data.items;
                const mergedItems = mergeDuplicateItems(rawItems);
                updateCartState(mergedItems);
            })
            .catch(err => {
                console.error('Lỗi khi lấy giỏ hàng:', err);
            });
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateCartState = (items: CartItem[]) => {
        setCartItems(items);
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        setTotalQuantity(totalQty);
        setTotalPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0));

        setCartSummary(prev => ({
            ...prev,
            sum: totalQty,
        }));
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

        if (!userId) {
            console.warn('Không tìm thấy userId');
            return;
        }

        try {
            await removeCartItemAPI(userId, productId);
            const updated = cartItems.filter(item => item.productId !== productId);
            updateCartState(updated);
            message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            message.error('Xóa sản phẩm thất bại');
        }
    };

    const clearCart = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;

        if (!userId) {
            console.warn('Không tìm thấy userId');
            return;
        }

        try {
            await clearCartAPI(userId);
            updateCartState([]);
            message.success('Đã xoá tất cả sản phẩm trong giỏ hàng');
        } catch (error) {
            console.error('Lỗi khi xoá tất cả sản phẩm:', error);
            message.error('Xoá giỏ hàng thất bại');
        }
    };

    return (
        <div className="p-6 max-w-screen-lg mx-auto cart-container">
            <Title level={3}>Giỏ Hàng</Title>

            {cartItems.length === 0 ? (
                <div className="text-center my-10">
                    <Empty description="Giỏ hàng trống, vui lòng quay lại trang chủ." />
                    <Button type="primary" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>
                </div>
            ) : (
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={cartItems}
                        renderItem={item => (
                            <Card className="mb-4 cart-item" key={item.productId}>
                                <Row gutter={16} align="middle">
                                    <Col xs={24} sm={4}>
                                        <div className="product-image">
                                            <img
                                                src={
                                                    item.image
                                                        ? `${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`
                                                        : '/default-product.jpg'
                                                }
                                                alt={item.name}
                                                className="w-full cart-item-image"
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Text strong>{item.name}</Text>
                                        <div>{item.shortDescription}</div>
                                        <div>
                                            <Text type="secondary">
                                                {item.detailDescription}
                                            </Text>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={4} className="text-center">
                                        <Text>
                                            Giá: {item.price.toLocaleString('vi-VN')} ₫
                                        </Text>
                                    </Col>
                                    <Col xs={12} sm={4} className="text-center">
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={value =>
                                                updateQuantity(item.productId, value || 1)
                                            }
                                            className="mb-2"
                                        />
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeItem(item.productId)}
                                        >
                                            Xoá
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    />

                    <Card className="text-right cart-summary">
                        <Title level={4} className="total-price">
                            Tổng tiền: {totalPrice.toLocaleString('vi-VN')} ₫
                        </Title>
                        <Row justify="end" gutter={16} className="cart-actions">
                            <Col>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                >
                                    THANH TOÁN
                                </Button>
                            </Col>
                            <Col>
                                <Button danger onClick={clearCart} className="clear-btn">
                                    Xoá tất cả
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </>
            )}
        </div>
    );
};

export default CartPage;
