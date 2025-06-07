import { getVouchersForUserAPI } from '@/services/api';
import { Form, Select, Button, message } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface IVoucher {
    id: number;
    code: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    expirationDate: string;
}

interface Props {
    onApply: (voucherCode: string) => void;
}

const ApplyVoucherForm: React.FC<Props> = ({ onApply }) => {
    const [form] = Form.useForm();
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        try {
            const user = JSON.parse(storedUser);
            const uid = Number(user.id);
            setUserId(uid);

            setLoading(true);
            getVouchersForUserAPI(uid)
                .then((res) => {
                    if (res?.data) {
                        setVouchers(res.data);
                    }
                })
                .catch(() => {
                    message.error('Không thể tải danh sách voucher');
                })
                .finally(() => setLoading(false));
        } catch (e) {
            console.error(e);
        }
    }, []);

    const handleSubmit = (values: any) => {
        if (!values.voucherCode) {
            return message.warning('Vui lòng chọn mã giảm giá');
        }
        onApply(values.voucherCode); // Gọi hàm apply từ props
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
                name="voucherCode"
                label="Chọn mã giảm giá"
                rules={[{ required: true, message: 'Vui lòng chọn mã giảm giá' }]}
            >
                <Select placeholder="Chọn voucher" loading={loading}>
                    {vouchers.map((voucher) => (
                        <Option key={voucher.code} value={voucher.code}>
                            {voucher.code} - {voucher.discountType === 'PERCENT'
                                ? `${voucher.discountValue}%`
                                : `-${voucher.discountValue.toLocaleString('vi-VN')}%`}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Áp dụng
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ApplyVoucherForm;
