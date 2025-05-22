import { useState } from 'react';
import { App, Divider, Form, Input, Modal, Select, Upload, Button, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { createUserAPI, uploadFileAPI } from '@/services/api';
import type { RcFile, UploadFile } from 'antd/es/upload';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

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
    avatar: UploadFile[];
};

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    const normFile = (e: any) => {
        return Array.isArray(e) ? e : e?.fileList;
    };

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.preview as string);
    };

    const handleUploadAvatar = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;

        try {
            const res = await uploadFileAPI(file as File, "avatars");

            if (res && res.data) {
                const uploadedUrl = `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${res.data.fileName}`;
                const uploadedFile: UploadFile = {
                    uid: (file as RcFile).uid,
                    name: res.data.fileName,
                    status: 'done',
                    url: uploadedUrl,
                    thumbUrl: uploadedUrl,
                    originFileObj: file as RcFile
                };

                setAvatarFile(uploadedFile);
                await handlePreview(uploadedFile);

                setTimeout(() => {
                    onSuccess?.("ok", uploadedFile as any);
                }, 100);
            } else {
                onError?.(new Error(res?.message || "Upload failed"));
            }
        } catch (err: any) {
            onError?.(err);
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { name, email, password, gender, address, age } = values;

        const avatarBase64 = avatarFile
            ? await getBase64(avatarFile.originFileObj as RcFile)
            : '';

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
                setAvatarFile(null);
                setPreviewImage("");
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
                setAvatarFile(null);
                setPreviewImage("");
            }}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                layout="vertical"
                name="create-user"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="User Name"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không đúng định dạng!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                    <Select placeholder="Chọn giới tính">
                        <Select.Option value="MALE">Nam</Select.Option>
                        <Select.Option value="FEMALE">Nữ</Select.Option>
                        <Select.Option value="OTHER">Khác</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Tuổi"
                    name="age"
                    rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}>
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Avatar"
                    name="avatar"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Vui lòng chọn ảnh đại diện!" }]}>
                    <Upload
                        listType="picture"
                        maxCount={1}
                        customRequest={handleUploadAvatar}
                        fileList={avatarFile ? [avatarFile] : []}
                        onRemove={() => {
                            setAvatarFile(null);
                            setPreviewImage("");
                        }}
                        onPreview={handlePreview}
                        accept="image/*">
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>

                {previewImage && (
                    <Image
                        width={100}
                        src={previewImage}
                        style={{ marginTop: 10, borderRadius: 4 }}
                        preview={false}
                    />
                )}
            </Form>
        </Modal>
    );
};
export default CreateUser;
