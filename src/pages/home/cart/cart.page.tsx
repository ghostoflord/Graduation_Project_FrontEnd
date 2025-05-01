import { Card, Button, InputNumber, List, Typography, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { getCart } from '@/services/api';
// Import hàm lấy dữ liệu giỏ hàng từ backend

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

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Fetch cart data from backend
    useEffect(() => {
        const userId = '1'; // Thay bằng userId thực tế
        getCart(userId)
            .then(res => {
                const data = res.data;
                setCartItems(data.items);
                setTotalQuantity(data.quantity);
                setTotalPrice(data.price);
            })
            .catch(err => {
                console.error("Lỗi khi lấy giỏ hàng:", err);
            });
    }, []);

    const updateQuantity = (productId: number, quantity: number) => {
        setCartItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
    };

    const removeItem = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <div className="p-6 max-w-screen-lg mx-auto">
            <Title level={3}>Giỏ Hàng</Title>
            <List
                itemLayout="horizontal"
                dataSource={cartItems}
                renderItem={item => (
                    <Card className="mb-4">
                        <Row gutter={16} align="middle">
                            <Col xs={24} sm={4}>
                                <img src={item.image} alt={item.name} className="w-full" />
                            </Col>
                            <Col xs={24} sm={16}>
                                <Text strong>{item.name}</Text>
                                <div>{item.shortDescription}</div>
                            </Col>
                            <Col xs={24} sm={4} className="text-center">
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
            <Card className="text-right">
                <Title level={4}>Tổng tiền: {totalPrice.toLocaleString('vi-VN')} ₫</Title>
                <Row justify="end" gutter={16}>
                    <Col>
                        <Button type="primary" size="large">THANH TOÁN</Button>
                    </Col>
                    <Col>
                        <Button danger onClick={clearCart}>Xoá tất cả</Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default CartPage;
