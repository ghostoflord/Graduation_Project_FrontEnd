import { getVouchersForUserAPI } from '@/services/api';
import { Form, Select, Button, message } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
    onApply: (voucherCode: string) => void;
}

const ApplyVoucherForm: React.FC<Props> = ({ onApply }) => {
    const [form] = Form.useForm();
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [loading, setLoading] = useState(false);

    // Lấy userId từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    useEffect(() => {
        if (!userId) {
            message.error('Không xác định được người dùng.');
            return;
        }

        const fetchVouchers = async () => {
            setLoading(true);
            try {
                const res = await getVouchersForUserAPI(userId);
                console.log('Vouchers fetched:', res.data);
                if (res.data) {
                    setVouchers(res.data);
                } else {
                    message.error('Không lấy được danh sách voucher.');
                }
            } catch (error) {
                message.error('Đã xảy ra lỗi khi tải voucher.');
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, [userId]);

    // Xử lý khi form submit
    const handleFinish = (values: any) => {
        // So sánh voucher.id (number) với values.voucherId (string)
        const selectedVoucher = vouchers.find(v => String(v.id) === values.voucherId);
        if (selectedVoucher) {
            message.success('Áp dụng mã thành công!');
            onApply(selectedVoucher.code); // Gửi voucher code ra ngoài
            form.resetFields();
        } else {
            message.error('Không tìm thấy voucher đã chọn.');
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
                name="voucherId"
                label="Chọn mã giảm giá"
                rules={[{ required: true, message: 'Vui lòng chọn một mã giảm giá' }]}
            >
                <Select placeholder="Chọn voucher..." loading={loading}>
                    {vouchers.map((voucher) => (
                        <Option key={voucher.id} value={String(voucher.id)}>
                            {voucher.code} - Giảm {voucher.discountValue}
                            {voucher.percentage ? '%' : 'đ'} ({voucher.description})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block disabled={loading}>
                    Áp dụng
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ApplyVoucherForm;
