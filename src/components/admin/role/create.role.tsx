import { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Divider,
    App,
} from 'antd';
import { callCreateRole, callFetchPermissions } from '@/services/api';
import { FormProps } from 'antd/lib';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    description: string;
    permissions: string[];
};

const CreateRole = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    useEffect(() => {
        const fetchPermissions = async () => {
            setLoadingPermissions(true);
            try {
                const res = await callFetchPermissions('page=1&pageSize=100');
                if (res?.data?.result) {
                    console.log("Fetched permissions:", res.data.result);
                    setPermissions(res.data.result);
                }
            } catch (err) {
                notification.error({
                    message: 'Lỗi khi tải permissions',
                    description: String(err),
                });
            } finally {
                setLoadingPermissions(false);
            }
        };
        if (openModalCreate) {
            fetchPermissions();
        }
    }, [openModalCreate]);


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { name, description, permissions } = values;

        const payload: IRole = {
            name,
            description,
            permissions: permissions.map(id => ({ id })),
        };

        try {
            const res = await callCreateRole(payload);
            if (res?.data) {
                message.success('Tạo vai trò thành công');
                form.resetFields();
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Thất bại',
                    description: res.message,
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi gửi yêu cầu',
                description: String(err),
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Thêm mới vai trò"
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
                name="create-role"
                onFinish={onFinish}
                autoComplete="off"
            >
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
                    label="Quyền hạn"
                    name="permissions"
                    rules={[{ required: true, message: 'Vui lòng chọn quyền hạn!' }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Chọn các quyền"
                        loading={loadingPermissions}
                        optionFilterProp="label"
                    >
                        {permissions.map((p) => (
                            <Select.Option key={p.id} value={String(p.id)} label={p.name}>
                                {p.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateRole;
