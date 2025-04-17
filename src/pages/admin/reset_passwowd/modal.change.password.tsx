import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from "react";
import { sendRequest } from "@/services/api";

const ModalChangePassword = (props: any) => {
    const { isModalOpen, setIsModalOpen } = props;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userEmail, setUserEmail] = useState("");

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/forgot-password`,
            method: "POST",
            body: { email }
        });

        if (res?.data) {
            setUserEmail(res.data.email);
            setCurrent(1);
        } else {
            notification.error({
                message: "Lỗi API",
                description: res?.message || "Không thể gửi email xác nhận."
            });
        }
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

        const res = await sendRequest<IBackendRes<any>>({
            url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/reset-password`,
            method: "POST",
            body: { token, newPassword, confirmPassword, email: userEmail }
        });

        if (res?.data) {
            setCurrent(2);
        } else {
            notification.error({
                message: "Lỗi API",
                description: res?.message || "Không thể đổi mật khẩu."
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
                        <p>Nhập email để đổi mật khẩu:</p>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinishStep0}
                    >
                        <Form.Item name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Tiếp tục</Button>
                    </Form>
                </>
            )}

            {current === 1 && (
                <>
                    <div style={{ margin: "20px 0" }}>
                        <p>Nhập mã xác thực và mật khẩu mới:</p>
                    </div>
                    <Form layout="vertical" onFinish={onFinishStep1}>
                        <Form.Item name="token" rules={[{ required: true, message: "Nhập mã xác thực!" }]}>
                            <Input placeholder="Mã xác thực" />
                        </Form.Item>
                        <Form.Item name="newPassword" rules={[{ required: true, message: "Nhập mật khẩu mới!" }]}>
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" rules={[{ required: true, message: "Xác nhận mật khẩu!" }]}>
                            <Input.Password placeholder="Xác nhận mật khẩu" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Xác nhận</Button>
                    </Form>
                </>
            )}

            {current === 2 && (
                <div style={{ margin: "20px 0", textAlign: "center" }}>
                    <p> Đổi mật khẩu thành công! Vui lòng đăng nhập lại.</p>
                    <Button onClick={resetModal}>Đóng</Button>
                </div>
            )}
        </Modal>
    );
};

export default ModalChangePassword;