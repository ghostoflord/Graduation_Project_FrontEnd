import { useEffect, useState } from 'react';
import { App, Divider, Form, Input, Modal, Select } from 'antd';
import type { FormProps } from 'antd';
import { callUpdatePermission } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IPermission | null;
    setDataUpdate: (v: IPermission | null) => void;
}

type FieldType = {
    id?: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
};

const UpdatePermission = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        dataUpdate,
        setDataUpdate,
    } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                name: dataUpdate.name,
                apiPath: dataUpdate.apiPath,
                method: dataUpdate.method,
                module: dataUpdate.module,
            });
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const res = await callUpdatePermission({ ...values, id: dataUpdate?.id });
        if (res && res.data) {
            message.success('Cập nhật permission thành công');
            setOpenModalUpdate(false);
            setDataUpdate(null);
            form.resetFields();
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật quyền"
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
                name="form-update-permission"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item<FieldType> hidden name="id">
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Tên quyền"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="API Path"
                    name="apiPath"
                    rules={[{ required: true, message: 'Vui lòng nhập API Path!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Phương thức"
                    name="method"
                    rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
                >
                    <Select placeholder="Chọn phương thức">
                        <Select.Option value="GET">GET</Select.Option>
                        <Select.Option value="POST">POST</Select.Option>
                        <Select.Option value="PUT">PUT</Select.Option>
                        <Select.Option value="DELETE">DELETE</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Module"
                    name="module"
                    rules={[{ required: true, message: 'Vui lòng nhập module!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdatePermission;
