import { Card, Button, InputNumber, List, Typography, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { getCart } from '@/services/api';
import { useNavigate } from 'react-router-dom';

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

// Hàm gộp các sản phẩm trùng nhau (cùng productId)
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

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/thanh-toan');
    };

    // Fetch cart data and merge duplicates
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;

        if (!userId) {
            console.warn("Không tìm thấy userId");
            return;
        }

        getCart(userId)
            .then(res => {
                const rawItems: CartItem[] = res.data.items;
                const mergedItems = mergeDuplicateItems(rawItems);
                updateCartState(mergedItems);
            })
            .catch(err => {
                console.error("Lỗi khi lấy giỏ hàng:", err);
            });
    }, []);

    const updateCartState = (items: CartItem[]) => {
        setCartItems(items);
        setTotalQuantity(items.reduce((sum, item) => sum + item.quantity, 0));
        setTotalPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        const updated = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        );
        updateCartState(updated);
    };

    const removeItem = (productId: number) => {
        const updated = cartItems.filter(item => item.productId !== productId);
        updateCartState(updated);
    };

    const clearCart = () => {
        updateCartState([]);
    };

    return (
        <div className="p-6 max-w-screen-lg mx-auto cart-container">
            <Title level={3}>Giỏ Hàng</Title>
            <List
                itemLayout="horizontal"
                dataSource={cartItems}
                renderItem={item => (
                    <Card className="mb-4 cart-item">
                        <Row gutter={16} align="middle">
                            {/* Cột hình ảnh */}
                            <Col xs={24} sm={4}>
                                <img src={item.image} alt={item.name} className="w-full cart-item-image" />
                            </Col>

                            {/* Cột thông tin sản phẩm */}
                            <Col xs={24} sm={12}>
                                <Text strong>{item.name}</Text>
                                <div>{item.shortDescription}</div>
                                <div><Text type="secondary">{item.detailDescription}</Text></div>
                            </Col>

                            {/* Cột giá */}
                            <Col xs={12} sm={4} className="text-center">
                                <Text>Giá: {item.price.toLocaleString('vi-VN')} ₫</Text>
                            </Col>

                            {/* Cột điều chỉnh số lượng và nút xóa */}
                            <Col xs={12} sm={4} className="text-center">
                                <InputNumber
                                    min={1}
                                    value={item.quantity}
                                    onChange={(value) => updateQuantity(item.productId, value || 1)}
                                    className="mb-2"
                                />
                                <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(item.productId)}>
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
                        <Button danger onClick={clearCart} className="clear-btn">Xoá tất cả</Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default CartPage;
