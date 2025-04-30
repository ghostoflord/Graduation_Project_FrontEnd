import { Card, Button, InputNumber, List, Typography, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Title, Text } = Typography;

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    specs: string;
}

const initialItems: CartItem[] = [
    {
        id: 1,
        name: 'Laptop MSI Thin 15 B13UCX 2080VN | CPU i5-13420H | RAM 16GB | SSD 512GB PCIe | VGA RTX 2050 4GB | 15.6 FHD IPS & 144Hz | Win11',
        price: 67960000,
        quantity: 4,
        image: 'https://laptopnew.vn//media/product/250-30845-msi-thin-15.jpg',
        specs: 'RAM 32GB + SSD 1TB'
    },
    {
        id: 2,
        name: 'Laptop MSI Modern 14 C12MO 660VN | CPU i5-1235U | RAM 16GB DDR4 | SSD 512GB PCIe | VGA Onboard | 14.0 FHD IPS | Win11',
        price: 11290000,
        quantity: 1,
        image: 'https://laptopnew.vn//media/product/250-29394-msi-modern-14.jpg',
        specs: ''
    }
];

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);

    const updateQuantity = (id: number, quantity: number) => {
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                                <div>{item.specs}</div>
                            </Col>
                            <Col xs={24} sm={4} className="text-center">
                                <InputNumber
                                    min={1}
                                    value={item.quantity}
                                    onChange={(value) => updateQuantity(item.id, value || 1)}
                                    className="mb-2"
                                />
                                <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(item.id)}>
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
