import { useState } from 'react';
import {
    App,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Upload,
    Button
} from 'antd';
import type { FormProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createUserAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    email: string;
    password: string;
    gender: string;
    address: string;
    age: string;
};

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const [avatarBase64, setAvatarBase64] = useState<string>("");

    // Convert ảnh sang base64
    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { name, password, email, gender, address, age } = values;
        setIsSubmit(true);

        try {
            const res = await createUserAPI(
                name,
                email,
                password,
                gender,
                avatarBase64,
                address,
                age
            );

            if (res && res.data) {
                message.success('Tạo mới user thành công');
                form.resetFields();
                setAvatarBase64("");
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi gửi yêu cầu',
                description: String(err)
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Thêm mới người dùng"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
                setAvatarBase64("");
            }}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                name="create-user"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="User Name"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không đúng định dạng!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                    <Select placeholder="Chọn giới tính">
                        <Select.Option value="MALE">Nam</Select.Option>
                        <Select.Option value="FEMALE">Nữ</Select.Option>
                        <Select.Option value="OTHER">Khác</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Tuổi"
                    name="age"
                    rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item label="Avatar">
                    <Upload
                        beforeUpload={() => false} // ngăn upload auto
                        maxCount={1}
                        accept="image/*"
                        onChange={async (info) => {
                            const file = info.file.originFileObj;
                            if (file) {
                                const base64 = await getBase64(file);
                                setAvatarBase64(base64);
                            }
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                    {avatarBase64 && (
                        <img
                            src={avatarBase64}
                            alt="avatar preview"
                            style={{ width: 100, marginTop: 10, borderRadius: 4 }}
                        />
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUser;
