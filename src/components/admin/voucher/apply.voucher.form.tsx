import { useEffect, useState } from 'react';
import {
    App,
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Select
} from 'antd';
import { applyVoucherAPI, getUsersAPI } from '@/services/api';

interface IProps {
    openModalApply: boolean;
    setOpenModalApply: (v: boolean) => void;
}

type ApplyVoucherFormType = {
    userId: number;
    code: string;
    orderTotal: number;
};

const ApplyVoucherModal = ({ openModalApply, setOpenModalApply }: IProps) => {
    const [form] = Form.useForm<ApplyVoucherFormType>();
    const { message } = App.useApp();
    const [users, setUsers] = useState<any[]>([]);
    const [result, setResult] = useState<number | null>(null);
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (openModalApply) {
            getUsersAPI('page=0&size=1000')
                .then((res) => {
                    const userList = res.data?.result || [];
                    setUsers(userList);
                })
                .catch(() => {
                    message.error('Không thể tải danh sách người dùng');
                });
        }
    }, [openModalApply, message]);

    const onFinish = async (values: ApplyVoucherFormType) => {
        setIsSubmit(true);
        try {
            const res = await applyVoucherAPI(values.code, values.userId, values.orderTotal);
            if (res.data) {
                setResult(res.data);
                message.success(`Đã áp dụng: giảm ${res.data.toLocaleString()}₫`);
            } else {
                setResult(null);
                message.error(res.data?.message || 'Áp dụng thất bại');
            }
        } catch (e) {
            message.error('Có lỗi xảy ra khi gọi API');
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Áp dụng Voucher cho đơn hàng"
            open={openModalApply}
            onOk={() => form.submit()}
            onCancel={() => {
                form.resetFields();
                setOpenModalApply(false);
                setResult(null);
            }}
            okText="Áp dụng"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="userId"
                    label="Người dùng"
                    rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
                >
                    <Select
                        placeholder="Chọn người dùng"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as unknown as string)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        {users.map((user) => (
                            <Select.Option key={user.id} value={user.id}>
                                {user.fullName} ({user.email})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Mã voucher"
                    rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
                >
                    <Input placeholder="Nhập mã voucher" />
                </Form.Item>

                <Form.Item
                    name="orderTotal"
                    label="Tổng đơn hàng (₫)"
                    rules={[{ required: true, message: 'Vui lòng nhập tổng đơn hàng!' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Nhập số tiền đơn hàng"
                    />
                </Form.Item>
            </Form>

            {result !== null && (
                <div style={{ marginTop: 16 }}>
                    <strong>Giá trị giảm giá: </strong>
                    <span style={{ color: 'green' }}>{result.toLocaleString()}₫</span>
                </div>
            )}
        </Modal>
    );
};

export default ApplyVoucherModal;
