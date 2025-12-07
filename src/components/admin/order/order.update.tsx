import { useEffect, useState } from 'react';
import { App, Divider, Form, Input, Modal, Select, DatePicker } from 'antd';
import type { FormProps } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { updateOrderAPI } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: any;
    setDataUpdate: (v: any | null) => void;
}

type FieldType = {
    orderId: number;
    receiverName?: string;
    receiverAddress?: string;
    receiverPhone?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    shippingMethod?: string;
    trackingCode?: string;
    estimatedDeliveryTime?: Dayjs;
};

const UpdateOrder = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    useEffect(() => {
        if (dataUpdate) {
            form.resetFields();
            form.setFieldsValue({
                orderId: dataUpdate.id,
                receiverName: dataUpdate.receiverName,
                receiverAddress: dataUpdate.receiverAddress,
                receiverPhone: dataUpdate.receiverPhone,
                status: dataUpdate.status,
                paymentStatus: dataUpdate.paymentStatus,
                paymentMethod: dataUpdate.paymentMethod,
                shippingMethod: dataUpdate.shippingMethod,
                trackingCode: dataUpdate.trackingCode,
                estimatedDeliveryTime: dataUpdate.estimatedDeliveryTime
                    ? dayjs(dataUpdate.estimatedDeliveryTime)
                    : undefined
            });
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { orderId, estimatedDeliveryTime, ...rest } = values;
        setIsSubmit(true);
        const payload: UpdateOrderRequest = {
            ...rest,
            estimatedDeliveryTime: estimatedDeliveryTime
                ? estimatedDeliveryTime.toISOString()
                : undefined
        };


        const res = await updateOrderAPI(orderId, payload);
        if (res?.statusCode == 200) {
            message.success('Cập nhật đơn hàng thành công');
            setOpenModalUpdate(false);
            setDataUpdate(null);
            form.resetFields();
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res?.message
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật đơn hàng"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                name="form-update-order"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType> name="orderId" hidden>
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType> label="Tên người nhận" name="receiverName">
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Số điện thoại người nhận" name="receiverPhone">
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Địa chỉ người nhận" name="receiverAddress">
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Trạng thái đơn hàng" name="status">
                    <Select placeholder="Chọn trạng thái đơn">
                        <Select.Option value="PENDING">Chờ xác nhận</Select.Option>
                        <Select.Option value="CONFIRMED">Đã nhận hàng</Select.Option>
                        <Select.Option value="SHIPPING">Đang giao</Select.Option>
                        <Select.Option value="DELIVERED">Đã giao</Select.Option>
                        <Select.Option value="CANCELED">Đã hủy</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType> label="Trạng thái thanh toán" name="paymentStatus">
                    <Select placeholder="Chọn trạng thái thanh toán">
                        <Select.Option value="PAID">Đã thanh toán</Select.Option>
                        <Select.Option value="UNPAID">Chưa thanh toán</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType> label="Phương thức thanh toán" name="paymentMethod">
                    <Select placeholder="Chọn phương thức">
                        <Select.Option value="COD">COD</Select.Option>
                        <Select.Option value="VNPAY">VNPAY</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType> label="Phương thức giao hàng" name="shippingMethod">
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Mã vận đơn" name="trackingCode">
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Dự kiến giao hàng" name="estimatedDeliveryTime">
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateOrder;
