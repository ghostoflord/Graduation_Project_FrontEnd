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
    const [shippingMethod, setShippingMethod] = useState<string>('standard');
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
                        const mergedItems = mergeDuplicateItems(cartRes.data.items);
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
                .catch(() => message.error('Không thể lấy giỏ hàng'));
        } catch {
            message.error('Dữ liệu người dùng không hợp lệ');
        }
    }, []);

    const handlePlaceOrder = async (values: any) => {
        if (!userId) return message.error('Thiếu thông tin người dùng');

        const orderPayload: any = {
            userId,
            name: values.name,
            address: values.address,
            phone: values.phone,
            paymentMethod: paymentMethod.toUpperCase(),
            shippingMethod: shippingMethod.toUpperCase(),
            items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        if (isFlashSale && flashSaleItem?.flashSaleItemId && flashSaleItem?.productId) {
            orderPayload.flashSaleItemId = flashSaleItem.flashSaleItemId;
            orderPayload.flashSaleProductId = flashSaleItem.productId;
        }

        if (voucherCode && !isFlashSale) orderPayload.voucherCode = voucherCode;

        try {
            if (paymentMethod === 'cod') {
                const res = await placeOrderAPI(orderPayload);
                if (res?.statusCode === 201) {
                    message.success('Đặt hàng thành công!');
                    setCartSummary({ sum: 0 });
                    setTimeout(() => navigate('/'), 800);
                } else message.error(res?.message || 'Đặt hàng thất bại');
            } else {
                const paymentRef = `ORDER_${Date.now()}`;
                const res = await createVNPayURL({ ...orderPayload, amount: finalTotal, paymentRef });
                res?.data ? (window.location.href = res.data) : message.error('Không thể tạo URL thanh toán');
            }
        } catch {
            message.error('Lỗi khi xử lý đơn hàng');
        }
    };

    const handleApplyVoucher = async (code: string) => {
        if (!userId || isFlashSale) return;
        try {
            const res = await applyVoucherAPI(userId, code, totalPrice);
            const discount = res?.data?.discountAmount;
            if (discount !== undefined && discount >= 0) {
                setVoucherCode(code);
                setVoucherDiscount(discount);
                message.success(`Đã áp dụng mã: -${discount.toLocaleString('vi-VN')}₫`);
                setVoucherModalVisible(false);
            } else message.error(res?.message || 'Mã giảm giá không hợp lệ');
        } catch {
            message.error('Không thể áp dụng mã giảm giá');
        }
    };

    return (
        <div className="checkout-page">
            <div className="left-panel">
                <h2>Thông tin nhận hàng</h2>
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
                        <Input placeholder="Địa chỉ nhận hàng" />
                    </Form.Item>

                    <Form.Item
                        name="shippingMethod"
                        label="Ghi chú phương thức giao hàng"
                        rules={[{ required: true, message: 'Vui lòng nhập Ghi chú phương thức giao hàng' }]}
                    >
                        <Input
                            placeholder="Ví dụ: Giao qua GHTK, J&T, Test Shipping..."
                            value={shippingMethod}
                            onChange={(e) => setShippingMethod(e.target.value)}
                        />
                    </Form.Item>

                    <h2>Phương thức thanh toán</h2>
                    <Form.Item name="paymentMethod">
                        <Radio.Group
                            className="payment-methods"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <Radio.Button value="vnpay">VNPAY</Radio.Button>
                            <Radio.Button value="cod">COD (Thanh toán khi nhận)</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="order-btn"
                        size="large"
                        disabled={!cartItems.length}
                    >
                        {paymentMethod === 'cod' ? 'ĐẶT HÀNG' : 'THANH TOÁN VNPAY'}
                    </Button>
                </Form>
            </div>

            <div className="right-panel">
                <h3>Đơn hàng của bạn</h3>
                {cartItems.length === 0 ? (
                    <Text type="secondary">Giỏ hàng trống</Text>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <div key={item.productId} className="order-item">
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`}
                                    alt={item.name}
                                />
                                <div className="item-info">
                                    <Text strong>{item.name}</Text>
                                    <div className="text-gray">{item.shortDescription}</div>
                                    <div>Số lượng: {item.quantity}</div>
                                </div>
                                <div className="item-price text-red-500">
                                    {item.price.toLocaleString('vi-VN')}₫
                                </div>
                            </div>
                        ))}

                        <Divider />

                        {!isFlashSale && voucherCode && (
                            <div className="discount">
                                <Text>Mã giảm giá:</Text>
                                <Text type="success">{voucherCode}</Text>
                                <Text type="danger">
                                    -{voucherDiscount.toLocaleString('vi-VN')}₫
                                </Text>
                            </div>
                        )}

                        <div className="summary">
                            <div className="total">
                                <span>Tổng cộng:</span>
                                <span>{finalTotal.toLocaleString('vi-VN')}₫</span>
                            </div>
                            {!isFlashSale && (
                                <Button
                                    type="dashed"
                                    block
                                    onClick={() => setVoucherModalVisible(true)}
                                >
                                    + Nhập mã giảm giá
                                </Button>
                            )}
                            <div
                                className="back-link"
                                onClick={() => navigate('/')}
                            >
                                ← Quay về trang chủ
                            </div>
                        </div>
                    </>
                )}
            </div>

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
