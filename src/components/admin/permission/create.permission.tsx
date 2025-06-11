import { useState } from 'react';
import { App, Divider, Form, Input, Modal, Select } from 'antd';
import type { FormProps } from 'antd';
import { callCreatePermission } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    apiPath: string;
    method: string;
    module: string;
};

const CreatePermission = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        try {
            const res = await callCreatePermission(values);
            if (res?.statusCode === 201) {
                message.success('Tạo permission thành công');
                form.resetFields();
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Tạo permission thất bại',
                    description: res?.message || res?.error || 'Lỗi không xác định'
                });
            }
        } catch (err: any) {
            notification.error({
                message: 'Lỗi gửi yêu cầu',
                description: err?.response?.data?.message || err?.message || 'Lỗi không xác định'
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Tạo permission mới"
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
                name="create-permission"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Tên permission"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên permission!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="API Path"
                    name="apiPath"
                    rules={[{ required: true, message: 'Vui lòng nhập API path!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="HTTP Method"
                    name="method"
                    rules={[{ required: true, message: 'Vui lòng chọn method!' }]}
                >
                    <Select placeholder="Chọn method">
                        <Select.Option value="GET">GET</Select.Option>
                        <Select.Option value="POST">POST</Select.Option>
                        <Select.Option value="PUT">PUT</Select.Option>
                        <Select.Option value="DELETE">DELETE</Select.Option>
                        <Select.Option value="PATCH">PATCH</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Module"
                    name="module"
                    rules={[{ required: true, message: 'Vui lòng nhập tên module!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePermission;
