import { useEffect, useState } from 'react';
import {
    Modal, Form, Input, DatePicker, Switch, InputNumber, notification, Select, App
} from 'antd';
import type { FormProps } from 'antd';
import dayjs from 'dayjs';
import { updateVoucherAPI, getUsersAPI } from '@/services/api';

const { RangePicker } = DatePicker;

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IVoucher | null) => void;
    dataUpdate: IVoucher | null;
}

const UpdateVoucher = ({
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
}: IProps) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userList, setUserList] = useState<IUserTable[]>([]);
    const { message } = App.useApp();

    useEffect(() => {
        if (dataUpdate) {
            form.resetFields();
            form.setFieldsValue({
                code: dataUpdate.code,
                description: dataUpdate.description,
                discountValue: dataUpdate.discountValue,
                percentage: dataUpdate.percentage,
                singleUse: dataUpdate.singleUse,
                active: dataUpdate.active,
                used: dataUpdate.used,
                dateRange: [dayjs(dataUpdate.startDate), dayjs(dataUpdate.endDate)],
                assignedUserId: dataUpdate.assignedUser?.id || null,
            });
        }
    }, [dataUpdate]);

    // ✅ Fetch danh sách user
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsersAPI('page=1&limit=1000');
                if (res.data && Array.isArray(res.data.result)) {
                    setUserList(res.data.result);
                }
            } catch (err) {
                notification.error({ message: 'Lỗi khi tải danh sách người dùng' });
            }
        };

        if (openModalUpdate) {
            fetchUsers();
        }
    }, [openModalUpdate]);

    const onFinish: FormProps<IVoucherUpdateDTO>['onFinish'] = async (values) => {
        const {
            code, description, discountValue, percentage, singleUse, active, used, assignedUserId, dateRange,
        } = values;
        const dto: IVoucherUpdateDTO = {
            code,
            description,
            discountValue,
            percentage,
            singleUse,
            active,
            used,
            assignedUserId: assignedUserId || null,
            startDate: dateRange?.[0]?.toISOString(),
            endDate: dateRange?.[1]?.toISOString(),
        };

        setIsSubmitting(true);
        const res = await updateVoucherAPI(dataUpdate!.id, dto);
        if (res && res.data) {
            message.success('Cập nhật voucher thành công!');
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi khi cập nhật',
                description: res?.message || 'Có lỗi xảy ra',
            });
        }
        setIsSubmitting(false);
    };

    return (
        <Modal
            title="Cập nhật Voucher"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmitting}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item label="Mã voucher" name="code" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label="Giá trị giảm" name="discountValue" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Phần trăm?" name="percentage" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Dùng một lần?" name="singleUse" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Đang hoạt động?" name="active" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Đã sử dụng?" name="used" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Thời gian áp dụng" name="dateRange" rules={[{ required: true }]}>
                    <RangePicker showTime />
                </Form.Item>

                <Form.Item label="Gán cho người dùng (nếu có)" name="assignedUserId">
                    <Select allowClear placeholder="Chọn người dùng">
                        {userList.map((user) => (
                            <Select.Option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateVoucher;
