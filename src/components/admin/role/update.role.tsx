import { callUpdateRole, callFetchPermissions } from '@/services/api';
import { App, Divider, Form, Input, Modal, Select, Spin } from 'antd';
import type { FormProps } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IRole | null) => void;
    dataUpdate: IRole | null;
}

type FieldType = {
    id?: string;
    name: string;
    description: string;
    permissions: string[]; // danh sách ID
};

const UpdateRole = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate,
    } = props;

    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    // 👇 State mới: danh sách quyền
    const [permissionOptions, setPermissionOptions] = useState<IPermission[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    // 👇 Gọi API lấy danh sách quyền khi mở modal
    useEffect(() => {
        if (openModalUpdate) {
            fetchPermissions();
        }
    }, [openModalUpdate]);

    const fetchPermissions = async () => {
        setLoadingPermissions(true);
        try {
            const res = await callFetchPermissions('page=1&limit=100'); // tùy chỉnh query
            if (res?.data?.result) {
                setPermissionOptions(res.data.result);
            }
        } catch (err) {
            console.error('Lỗi load permissions:', err);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải danh sách quyền',
            });
        } finally {
            setLoadingPermissions(false);
        }
    };

    // Khi mở modal, fill form với dataUpdate
    useEffect(() => {
        if (dataUpdate) {
            form.resetFields();
            form.setFieldsValue({
                id: dataUpdate.id,
                name: dataUpdate.name,
                description: dataUpdate.description,
                permissions: dataUpdate.permissions?.map((p: any) =>
                    typeof p === 'string' ? p : String(p.id)
                ),
            });
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        const payload: IRole = {
            id: values.id,
            name: values.name,
            description: values.description,
            permissions: values.permissions.map((id) => ({ id: Number(id) })),
        };

        const res = await callUpdateRole(payload);
        if (res && res.data) {
            message.success('Cập nhật role thành công!');
            setOpenModalUpdate(false);
            setDataUpdate(null);
            form.resetFields();
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi',
                description: res?.message || 'Cập nhật thất bại',
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật vai trò"
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
                name="form-update-role"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType> hidden name="id">
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Tên vai trò"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
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
                    label="Quyền"
                    name="permissions"
                    rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Chọn quyền"
                        loading={loadingPermissions}
                        optionFilterProp="label"
                    >
                        {permissionOptions.map((permission) => (
                            <Select.Option
                                key={permission.id}
                                value={String(permission.id)}
                                label={permission.name}
                            >
                                {permission.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateRole;
