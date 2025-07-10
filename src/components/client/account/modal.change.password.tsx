import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from "react";
import { sendRequest } from "@/services/api";

interface ModalChangePasswordProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    onSuccess?: () => void;
}

const ModalChangePassword = (props: ModalChangePasswordProps) => {
    const { isModalOpen, setIsModalOpen, onSuccess } = props;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userEmail, setUserEmail] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        setIsSubmit(true);
        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/send-reset-otp`,
            method: "POST",
            body: { email },
        });

        if (res?.statusCode === 200) {
            setUserEmail(res.data.email);
            setCurrent(1);
            notification.success({
                message: "Gửi mã OTP thành công",
                description: "Vui lòng kiểm tra email để lấy mã xác thực."
            });
        } else {
            notification.error({
                message: "Lỗi gửi OTP",
                description: res?.message || "Không thể gửi mã xác thực. Vui lòng thử lại."
            });
        }
        setIsSubmit(false);
    };

    const onFinishStep1 = async (values: any) => {
        const { token, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
            notification.error({
                message: "Lỗi nhập liệu",
                description: "Mật khẩu và xác nhận mật khẩu không khớp!"
            });
            return;
        }

        const res = await sendRequest({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/reset-password`,
            method: "POST",
            body: {
                token,
                newPassword
            }
        });

        if (res?.statusCode === 200) {
            notification.success({
                message: "Đặt lại mật khẩu thành công",
                description: "Bạn sẽ được chuyển hướng đến trang đăng nhập."
            });

            setCurrent(2);
            if (onSuccess) {
                setTimeout(() => onSuccess(), 1000);
            }
        } else {
            notification.error({
                message: "Lỗi đổi mật khẩu",
                description: res?.message || "Không thể đổi mật khẩu. Vui lòng thử lại."
            });
        }
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setCurrent(0);
        setUserEmail("");
        form.resetFields();
    };

    return (
        <Modal
            title="Quên mật khẩu"
            open={isModalOpen}
            onCancel={resetModal}
            maskClosable={false}
            footer={null}
        >
            <Steps
                current={current}
                items={[
                    { title: 'Email', icon: <UserOutlined /> },
                    { title: 'Xác thực', icon: <SolutionOutlined /> },
                    { title: 'Hoàn thành', icon: <SmileOutlined /> }
                ]}
            />

            {current === 0 && (
                <>
                    <div style={{ margin: "20px 0" }}>
                        <p>Nhập email để nhận mã xác thực:</p>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinishStep0}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" }
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmit}>Gửi mã OTP</Button>
                    </Form>
                </>
            )}

            {current === 1 && (
                <>
                    <div style={{ margin: "20px 0" }}>
                        <p>Nhập mã OTP và mật khẩu mới:</p>
                    </div>
                    <Form layout="vertical" onFinish={onFinishStep1}>
                        <Form.Item name="token" rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}>
                            <Input placeholder="Mã OTP 6 chữ số" />
                        </Form.Item>
                        <Form.Item name="newPassword" rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}>
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}>
                            <Input.Password placeholder="Xác nhận mật khẩu" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Xác nhận</Button>
                    </Form>
                </>
            )}

            {current === 2 && (
                <div style={{ margin: "20px 0", textAlign: "center" }}>
                    <p>Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.</p>
                    <Button onClick={resetModal}>Đóng</Button>
                </div>
            )}
        </Modal>
    );
};

export default ModalChangePassword;
