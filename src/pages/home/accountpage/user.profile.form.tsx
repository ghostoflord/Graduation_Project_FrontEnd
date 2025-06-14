import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Select, message, Spin, Avatar } from "antd";
import { getUserByIdAPI, selfUpdateUserAPI } from "@/services/api";

const { Option } = Select;

interface Props {
    userId: number;
}

const UserProfileForm = ({ userId }: Props) => {
    const [form] = Form.useForm<IUserTable>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const res = await getUserByIdAPI(userId);
            if (res?.data) {
                const user = res.data;

                // Lưu avatar để hiển thị
                if (user.avatar) {
                    setAvatarUrl(`${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user.avatar}`);
                }

                // Định dạng role ID nếu có
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

    const onFinish = async (values: IUserTable) => {
        try {
            setSubmitting(true);
            const res = await selfUpdateUserAPI({ ...values, id: userId });
            if (res?.data?.statusCode === 200) {
                message.success("Cập nhật thông tin thành công");
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
                    {avatarUrl && (
                        <div style={{ marginBottom: 16 }}>
                            <Avatar size={64} src={avatarUrl} />
                        </div>
                    )}

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
