import { useState } from 'react';
import { App, Button, DatePicker, Divider, Form, Input, InputNumber, Modal, Switch } from 'antd';
import type { FormProps } from 'antd';
import dayjs from 'dayjs';
import { createVoucherAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    code: string;
    description: string;
    discountValue: number;
    percentage: boolean;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    singleUse: boolean;
};

const CreateVoucher = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const payload = {
            ...values,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString()
        };

        try {
            const res = await createVoucherAPI(payload);
            if (res && res.data) {
                message.success('Tạo mã giảm giá thành công!');
                form.resetFields();
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Tạo thất bại',
                    description: res.message
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi gửi yêu cầu',
                description: String(error)
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Tạo mã giảm giá"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                form.resetFields();
                setOpenModalCreate(false);
            }}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                layout="vertical"
                name="create-voucher"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Mã giảm giá"
                    name="code"
                    rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Giá trị giảm"
                    name="discountValue"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Nhập số tiền hoặc phần trăm"
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Là phần trăm?"
                    name="percentage"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Chỉ sử dụng 1 lần?"
                    name="singleUse"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateVoucher;
