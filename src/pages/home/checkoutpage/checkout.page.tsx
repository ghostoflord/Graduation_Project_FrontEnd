import React, { useEffect, useState } from 'react';
import './checkout.page.scss';
import {
    Form,
    Input,
    Button,
    Radio,
    Row,
    Col,
    Typography,
    Card,
    Divider,
    message,
    Modal,
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    checkoutOrder,
    getCart,
    placeOrderAPI,
    createVNPayURL,
    applyVoucherAPI,
} from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';
import ApplyVoucherForm from '@/pages/admin/voucher/apply.voucher.form';

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
    items.forEach((item) => {
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

const CheckoutPage: React.FC = () => {
    const [form] = Form.useForm();
    const [userId, setUserId] = useState<number | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>('cod');
    const [voucherCode, setVoucherCode] = useState<string | null>(null);
    const [voucherDiscount, setVoucherDiscount] = useState<number>(0);
    const [voucherModalVisible, setVoucherModalVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setCartSummary } = useCurrentApp();

    const flashSaleItem = location.state?.flashSaleItem;
    const isFlashSale = !!flashSaleItem;

    const finalTotal = Math.max(totalPrice - (isFlashSale ? 0 : voucherDiscount), 0);

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
            form.setFieldsValue({
                name: user.name || '',
                address: user.address || '',
                phone: user.phone || '',
            });

            getCart(uid)
                .then((cartRes) => {
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
                .catch((err) => {
                    console.error('Lỗi khi lấy giỏ hàng:', err);
                    message.error('Không thể lấy giỏ hàng');
                });
        } catch (e) {
            console.error('Lỗi khi phân tích user từ localStorage:', e);
            message.error('Dữ liệu người dùng không hợp lệ');
        }
    }, []);

    const handlePlaceOrder = async (values: any) => {
        if (!userId) return message.error('Thiếu thông tin người dùng');

        const itemsToCheckout = cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
        }));

        const orderPayload: any = {
            userId,
            name: values.name,
            address: values.address,
            phone: values.phone,
            items: itemsToCheckout,
        };

        if (voucherCode && !isFlashSale) {
            orderPayload.voucherCode = voucherCode;
        }

        if (paymentMethod === 'cod') {
            try {
                const res = await placeOrderAPI(orderPayload);
                if (res?.statusCode === 201) {
                    await checkoutOrder(itemsToCheckout);
                    message.success('Đặt hàng thành công!');
                    setCartSummary({ sum: 0 });
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
                    amount: finalTotal,
                    paymentRef,
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

    const handleApplyVoucher = async (code: string) => {
        if (!userId || isFlashSale) return;

        try {
            const res = await applyVoucherAPI(userId, code, totalPrice);
            const discount = res?.data?.discountAmount;
            const messageFromBackend = res?.data?.message || res?.message;

            if (discount !== undefined && discount >= 0) {
                setVoucherCode(code);
                setVoucherDiscount(discount);
                message.success(`Đã áp dụng mã: -${discount.toLocaleString('vi-VN')}₫`);
                setVoucherModalVisible(false);
            } else {
                message.error(messageFromBackend || 'Mã giảm giá không hợp lệ');
            }
        } catch (err) {
            console.error('Lỗi khi gọi API voucher:', err);
            message.error('Không thể áp dụng mã giảm giá');
        }
    };

    const getDiscountedPrice = (item: CartItem) => {
        if (!voucherCode || voucherDiscount <= 0 || isFlashSale) {
            return item.price * item.quantity;
        }
        const discountRatio = voucherDiscount / totalPrice;
        const original = item.price * item.quantity;
        const discounted = original - original * discountRatio;
        return Math.round(discounted);
    };

    return (
        <div className="checkout-container">
            <Row gutter={32}>
                <Col span={14} className="checkout-left">
                    <Title level={4}>Thông tin nhận hàng</Title>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handlePlaceOrder}
                        initialValues={{ paymentMethod: 'cod' }}
                    >
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input placeholder="Địa chỉ" />
                        </Form.Item>

                        <Title level={4}>Thanh toán</Title>
                        <Form.Item name="paymentMethod">
                            <Radio.Group
                                className="payment-methods"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <Radio.Button value="vnpay">VNPAY</Radio.Button>
                                <Radio.Button value="cod">Thanh toán khi nhận (COD)</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            className="place-order-btn"
                            disabled={cartItems.length === 0}
                        >
                            {paymentMethod === 'cod' ? 'ĐẶT HÀNG' : 'THANH TOÁN VNPAY'}
                        </Button>
                    </Form>
                </Col>

                <Col span={10} className="checkout-right">
                    <Card className="order-summary">
                        <Title level={5}>Đơn hàng</Title>
                        {cartItems.length === 0 ? (
                            <Text type="secondary">Không có sản phẩm trong giỏ hàng</Text>
                        ) : (
                            <>
                                {cartItems.map((item) => (
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
                                            {getDiscountedPrice(item).toLocaleString('vi-VN')}₫
                                        </Text>
                                    </div>
                                ))}

                                <Divider />

                                {!isFlashSale && voucherCode && (
                                    <div className="summary-voucher">
                                        <Text>Mã giảm giá: </Text>
                                        <Text type="success">{voucherCode}</Text>
                                        <br />
                                        <Text>Giảm: </Text>
                                        <Text type="danger">
                                            - {voucherDiscount.toLocaleString('vi-VN')}₫
                                        </Text>
                                    </div>
                                )}

                                <div className="summary-total">
                                    <Text strong>Tổng cộng</Text>
                                    <Text strong className="total-amount">
                                        {finalTotal.toLocaleString('vi-VN')}₫
                                    </Text>
                                </div>

                                {!isFlashSale && (
                                    <Button type="dashed" block onClick={() => setVoucherModalVisible(true)}>
                                        + Nhập mã giảm giá
                                    </Button>
                                )}
                            </>
                        )}
                        <Button type="link" block onClick={() => navigate('/')}>
                            ← Quay về trang chủ
                        </Button>
                    </Card>
                </Col>
            </Row>

            {!isFlashSale && (
                <Modal
                    open={voucherModalVisible}
                    title="Áp dụng mã giảm giá"
                    onCancel={() => setVoucherModalVisible(false)}
                    footer={null}
                    destroyOnClose
                >
                    <ApplyVoucherForm onApply={handleApplyVoucher} />
                </Modal>
            )}
        </div>
    );
};

export default CheckoutPage;
