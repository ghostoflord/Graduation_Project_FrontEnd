import React, { useEffect, useState } from "react";
import {
    Input,
    Button,
    Typography,
    Divider,
    message,
    Modal,
    Radio,
    Form,
    Card
} from "antd";
import {
    getCart,
    checkoutOrder,
    placeOrderAPI,
    createVNPayURL,
    applyVoucherAPI,
} from "@/services/api";
import { useNavigate, useLocation } from "react-router-dom";
import ApplyVoucherForm from "@/pages/admin/voucher/apply.voucher.form";
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

interface FlashSaleItem {
    flashSaleItemId?: number;
    productId?: number;
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
    const [form] = Form.useForm();
    const [userId, setUserId] = useState<number | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
    const [voucherCode, setVoucherCode] = useState<string | null>(null);
    const [voucherDiscount, setVoucherDiscount] = useState<number>(0);
    const [voucherModalVisible, setVoucherModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const flashSaleItem: FlashSaleItem = location.state?.flashSaleItem || {};
    const isFlashSale = !!flashSaleItem?.flashSaleItemId;
    const finalTotal = Math.max(totalPrice - (isFlashSale ? 0 : voucherDiscount), 0);

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

            form.setFieldsValue({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                shippingMethod: 'Giao hàng tiêu chuẩn',
            });

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

    const handleApplyVoucher = async (code: string) => {
        if (!userId || isFlashSale) return;
        try {
            const res = await applyVoucherAPI(userId, code, totalPrice);
            const discount = res?.data?.discountAmount;
            if (discount !== undefined && discount >= 0) {
                setVoucherCode(code);
                setVoucherDiscount(discount);
                message.success(`Đã áp dụng mã: -${discount.toLocaleString("vi-VN")}₫`);
                setVoucherModalVisible(false);
            } else {
                message.error(res?.message || 'Mã giảm giá không hợp lệ');
            }
        } catch {
            message.error("Không thể áp dụng mã giảm giá");
        }
    };

    const handlePlaceOrder = async (values: any) => {
        if (!userId) return message.error("Thiếu thông tin người dùng");

        setLoading(true);

        const orderPayload: any = {
            userId,
            name: values.name,
            address: values.address,
            phone: values.phone,
            paymentMethod: paymentMethod.toUpperCase(),
            shippingMethod: values.shippingMethod,
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
                    // ✅ Clear cart sau khi đặt hàng thành công
                    await checkoutOrder(orderPayload.items);
                    message.success("Đặt hàng thành công!");
                    localStorage.setItem("cartSummary", JSON.stringify({ sum: 0 }));
                    setTimeout(() => navigate("/"), 1500);
                } else {
                    message.error(res?.message || "Đặt hàng thất bại");
                }
            } else {
                const paymentRef = `ORDER_${Date.now()}`;
                const res = await createVNPayURL({
                    ...orderPayload,
                    amount: finalTotal,
                    paymentRef
                });

                // ✅ FIX: Kiểm tra kỹ response structure
                if (res?.data) {
                    window.location.href = res.data;
                } else if (res?.url) {
                    window.location.href = res.url;
                } else {
                    console.error('VNPay response:', res);
                    message.error("Không thể tạo URL thanh toán");
                }
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            message.error(err?.response?.data?.message || "Lỗi khi xử lý đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const validatePhone = (_: any, value: string) => {
        const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        if (!value) {
            return Promise.reject(new Error('Vui lòng nhập số điện thoại'));
        }
        if (!phoneRegex.test(value)) {
            return Promise.reject(new Error('Số điện thoại không hợp lệ'));
        }
        return Promise.resolve();
    };

    return (
        <div className="checkout-mobile">
            <div className="checkout-header">
                <Title level={2} className="brand-title">LAPTOPSHOP</Title>
                <Text className="page-subtitle">Thanh toán đơn hàng</Text>
            </div>

            {/* Summary Card */}
            <Card className="summary-card" bordered={false}>
                <div className="summary-header">
                    <Text strong className="summary-title">Đơn hàng ({cartItems.length} sản phẩm)</Text>
                    <Text className="total-price">{finalTotal.toLocaleString("vi-VN")}₫</Text>
                </div>

                {!isFlashSale && voucherCode && (
                    <div className="voucher-discount-mobile">
                        <Text>Mã giảm giá: <Text type="success" strong>{voucherCode}</Text></Text>
                        <Text type="danger" strong>-{voucherDiscount.toLocaleString("vi-VN")}₫</Text>
                    </div>
                )}
            </Card>

            {/* Product List */}
            {/* Product List */}
            <div className="products-section">
                <div className="section-header">
                    <Text strong className="section-title">Sản phẩm trong đơn</Text>
                    <Text className="product-count">({cartItems.length} sản phẩm)</Text>
                </div>
                <div className="checkout-product-list">
                    {cartItems.map((item, index) => (
                        <div key={item.productId} className="product-item">
                            <div className="product-main">
                                <div className="product-image-container">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/upload/products/${item.image}`}
                                        alt={item.name}
                                        className="product-image"
                                    />
                                    <div className="product-badge">{index + 1}</div>
                                </div>
                                <div className="product-content">
                                    <div className="product-header">
                                        <Text strong className="product-name">{item.name}</Text>
                                        <Text className="product-price">
                                            {item.price.toLocaleString("vi-VN")}₫
                                        </Text>
                                    </div>
                                    <Text className="product-short-desc">{item.shortDescription}</Text>
                                    <div className="product-footer">
                                        <div className="quantity-badge">
                                            Số lượng: {item.quantity}
                                        </div>
                                        <div className="product-total">
                                            Thành tiền: <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {item.detailDescription && (
                                <div className="product-detail-desc">
                                    <Text type="secondary">{item.detailDescription}</Text>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Divider />

            {/* Checkout Form */}
            <div className="checkout-form-section">
                <div className="section-header">
                    <Text strong className="section-title">Thông tin nhận hàng</Text>
                    <Button
                        type="link"
                        className="logout-btn"
                        onClick={() => {
                            localStorage.removeItem("user");
                            message.success("Đăng xuất thành công");
                            navigate("/login");
                        }}
                    >
                        Đăng xuất
                    </Button>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlePlaceOrder}
                    className="checkout-form"
                >
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên' },
                            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Nhập họ và tên"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            // { validator: validatePhone }
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Nhập số điện thoại"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ nhận hàng"
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ' },
                            { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' }
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập địa chỉ chi tiết..."
                            className="form-textarea"
                        />
                    </Form.Item>

                    <Form.Item
                        name="shippingMethod"
                        label="Phương thức giao hàng"
                        rules={[{ required: true, message: 'Vui lòng nhập phương thức giao hàng' }]}
                    >
                        <Input
                            size="large"
                            placeholder="Ví dụ: Giao hàng tiêu chuẩn, Giao nhanh..."
                            className="form-input"
                        />
                    </Form.Item>

                    {/* Payment Method */}
                    <div className="payment-section">
                        <Text strong className="section-title">Phương thức thanh toán</Text>
                        <Radio.Group
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="payment-radio-group"
                            size="large"
                        >
                            <Radio.Button value="cod" className="payment-option">
                                <div className="payment-option-content">
                                    <Text strong>COD:</Text>
                                    <Text type="secondary">Thanh toán khi nhận hàng</Text>
                                </div>
                            </Radio.Button>
                            <Radio.Button value="vnpay" className="payment-option">
                                <div className="payment-option-content">
                                    <Text strong>VNPAY:</Text>
                                    <Text type="secondary">Thanh toán online</Text>
                                </div>
                            </Radio.Button>
                        </Radio.Group>
                    </div>

                    {/* Voucher Button */}
                    {!isFlashSale && (
                        <Button
                            type="dashed"
                            size="large"
                            block
                            onClick={() => setVoucherModalVisible(true)}
                            className="voucher-btn"
                            icon={<span>🎁</span>}
                        >
                            {voucherCode ? `Mã đã áp dụng: ${voucherCode}` : 'Nhập mã giảm giá'}
                        </Button>
                    )}

                    {/* Order Button */}
                    <Button
                        type="primary"
                        size="large"
                        block
                        htmlType="submit"
                        loading={loading}
                        disabled={!cartItems.length}
                        className="order-btn"
                    >
                        {paymentMethod === 'cod'
                            ? `ĐẶT HÀNG - ${finalTotal.toLocaleString("vi-VN")}₫`
                            : `THANH TOÁN VNPAY - ${finalTotal.toLocaleString("vi-VN")}₫`
                        }
                    </Button>

                    <Button
                        type="link"
                        block
                        onClick={() => navigate("/")}
                        className="back-btn"
                    >
                        ← Quay về trang chủ
                    </Button>
                </Form>
            </div>

            {/* Voucher Modal */}
            {!isFlashSale && (
                <Modal
                    open={voucherModalVisible}
                    title="🎁 Áp dụng mã giảm giá"
                    onCancel={() => setVoucherModalVisible(false)}
                    footer={null}
                    destroyOnClose
                    className="voucher-modal"
                >
                    <ApplyVoucherForm onApply={handleApplyVoucher} />
                </Modal>
            )}
        </div>
    );
};

export default CheckoutMobile;