import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    Select,
    message,
    Spin,
    Avatar,
    Upload,
    Image
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type { RcCustomRequestOptions } from "antd/es/upload";
import {
    getUserByIdAPI,
    selfUpdateUserAPI,
    uploadFileAPI
} from "@/services/api";

const { Option } = Select;

interface Props {
    userId: number;
    onUpdateSuccess?: () => void;
}

const UserProfileForm = ({ userId, onUpdateSuccess }: Props) => {
    const [form] = Form.useForm<IUserTable>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const res = await getUserByIdAPI(userId);
            if (res?.data) {
                const user = res.data;

                if (user.avatar) {
                    const fullAvatarUrl = `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user.avatar}`;
                    setAvatarUrl(fullAvatarUrl);

                    const file: UploadFile = {
                        uid: '-1',
                        name: user.avatar,
                        status: 'done',
                        url: fullAvatarUrl,
                        thumbUrl: fullAvatarUrl
                    };
                    setAvatarFile(file);
                    setPreviewImage(fullAvatarUrl);
                }

                const formattedUser = {
                    ...user,
                    role: user.role?.id ?? null,
                };

                form.setFieldsValue(formattedUser);
            } else {
                message.error("Không thể tải thông tin người dùng");
            }
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi tải thông tin");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAvatar = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await uploadFileAPI(file as File, 'avatars');
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
                onSuccess?.("ok", uploadedFile as any);
            } else {
                onError?.(new Error(res?.message || "Upload failed"));
            }
        } catch (err: any) {
            onError?.(err);
        }
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.preview as string);
    };

    const onFinish = async (values: IUserTable) => {
        try {
            setSubmitting(true);

            const avatarBase64 = avatarFile?.originFileObj
                ? await getBase64(avatarFile.originFileObj as RcFile)
                : '';

            const res = await selfUpdateUserAPI({
                ...values,
                id: userId,
                avatar: avatarBase64
            });

            if (res?.data) {
                message.success("Cập nhật thông tin thành công");
                onUpdateSuccess?.();
            } else {
                message.error(res?.data?.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error(error);
            message.error("Có lỗi khi cập nhật thông tin");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title="Thông tin cá nhân" bordered={false}>
            {loading ? (
                <Spin />
            ) : (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Nhập tên" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
                        <Select>
                            <Option value="MALE">Nam</Option>
                            <Option value="FEMALE">Nữ</Option>
                            <Option value="OTHER">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Địa chỉ" name="address">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Tuổi" name="age">
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item label="Avatar" name="avatar">
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
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {previewImage && (
                            <Image
                                width={100}
                                src={previewImage}
                                style={{ marginTop: 10, borderRadius: 4 }}
                                preview={false}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Card>
    );
};

export default UserProfileForm;
