import React from 'react';
import './checkout.page.scss';
import { Input, Button, Select, Radio, Row, Col, Typography, Card, Divider } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const CheckoutPage = () => {
    return (
        <div className="checkout-container">
            <Row gutter={32}>
                <Col span={14} className="checkout-left">
                    <Title level={4}>Thông tin nhận hàng</Title>
                    <Input placeholder="Email (tùy chọn)" className="mb-3" />
                    <Input placeholder="Họ và tên" className="mb-3" />
                    <Input placeholder="Số điện thoại" className="mb-3" addonAfter={<span className="flag-icon">🇻🇳</span>} />
                    <Input placeholder="Địa chỉ (tùy chọn)" className="mb-3" />
                    <Select placeholder="Tỉnh thành" className="mb-3 w-full">
                        <Option value="">---</Option>
                        <Option value="hcm">TP.HCM</Option>
                        <Option value="hn">Hà Nội</Option>
                    </Select>
                    <Input.TextArea placeholder="Ghi chú (tùy chọn)" rows={4} className="mb-3" />

                    <Title level={4}>Thanh toán</Title>
                    <Radio.Group className="payment-methods">
                        <Radio.Button value="bank">Chuyển khoản qua ngân hàng</Radio.Button>
                        <Radio.Button value="cod">Thanh toán khi giao hàng (COD)</Radio.Button>
                    </Radio.Group>
                </Col>

                <Col span={10} className="checkout-right">
                    <Card className="order-summary">
                        <Title level={5}>Đơn hàng (9 sản phẩm)</Title>
                        <div className="product-row">
                            <img
                                src="https://laptopnew.vn/media/product/250-44493-laptop-msi-modern-14-c12mo-660vn.jpg"
                                alt="Laptop"
                            />
                            <div className="product-info">
                                <Text strong>Laptop MSI Modern 14 C12MO</Text>
                                <div>660VN | i5-1235U | 16GB RAM | 512GB SSD</div>
                                <div>14.0" FHD IPS | Win11</div>
                            </div>
                            <Text className="product-price">101.610.000₫</Text>
                        </div>

                        <Input placeholder="Nhập mã giảm giá" className="mb-3" addonAfter={<Button>Áp dụng</Button>} />

                        <div className="summary-line">
                            <Text>Tạm tính</Text>
                            <Text>101.610.000₫</Text>
                        </div>
                        <Divider />
                        <div className="summary-total">
                            <Text strong>Tổng cộng</Text>
                            <Text strong className="total-amount">101.610.000₫</Text>
                        </div>
                        <Button type="primary" block size="large" className="place-order-btn">
                            ĐẶT HÀNG
                        </Button>
                        <div className="go-back">← Quay về giỏ hàng</div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
