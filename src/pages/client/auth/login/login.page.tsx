import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './login.page.scss';
import { useState } from 'react';
import type { FormProps } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import { loginAPI, resendVerificationAPI } from '@/services/api';
import ModalChangePassword from '../../../../components/client/account/modal.change.password';
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import loginBg from '@/assets/dang_nhap.png';
type FieldType = {
    username: string;
    password: string;
};
const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { setIsAuthenticated, setUser } = useCurrentApp();
    const [changePassword, setChangePassword] = useState(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);

        try {
            const res = await loginAPI(username, password);
            if (res?.data) {
                const user = res.data.user;
                if (!user.email) {
                    notification.warning({
                        message: 'Không có email từ GitHub',
                        description: 'Vui lòng cung cấp email của bạn hoặc xác thực tài khoản qua phương thức khác.',
                    });
                    setIsSubmit(false);
                    return;
                }

                if (!user.active) {
                    notification.warning({
                        message: 'Tài khoản chưa được xác thực, vui lòng xác thực tài khoản',
                        description: (
                            <span>
                                Vui lòng nhấn{' '}
                                <Button
                                    type="link"
                                    onClick={async () => {
                                        try {
                                            console.log('Email cần gửi lại mã xác thực:', user.email);
                                            await resendVerificationAPI(user.email);
                                            notification.success({
                                                message: 'Gửi lại thành công',
                                                description: 'Vui lòng kiểm tra email để kích hoạt tài khoản.',
                                            });
                                        } catch (err) {
                                            notification.error({
                                                message: 'Lỗi',
                                                description: 'Không thể gửi lại mã xác thực. Vui lòng thử lại.',
                                            });
                                        }
                                    }}
                                >
                                    Gửi lại mã xác thực
                                </Button>
                            </span>
                        ),
                        duration: 0,
                    });
                    setIsSubmit(false);
                    return;
                }
                setIsAuthenticated(true);
                setUser(user);
                localStorage.setItem('access_token', res.data.access_token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                message.success('Đăng nhập tài khoản thành công!');

                if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'SHIPPER') {
                    navigate('/shipper');
                }
                else {
                    navigate('/');
                }
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5,
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi kết nối',
                description: error?.message || 'Không thể kết nối đến máy chủ',
                duration: 5,
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <>
            <div
                className="login-page"
                style={{
                    backgroundImage: `url(${loginBg})`,
                }}
            >
                <div className="login-overlay"></div>
                <div className="login-box">
                    <h2 className="login-title">Đăng nhập</h2>
                    <Divider />

                    <Form name="login-form" onFinish={onFinish} autoComplete="off">
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="E-mail"
                            name="username"
                            rules={[
                                { required: true, message: 'Email không được để trống!' },
                                { type: 'email', message: 'Email không đúng định dạng!' },
                            ]}
                        >
                            <Input placeholder="Nhập email" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>

                        <div className="login-actions">
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Đăng nhập
                            </Button>
                            <Button type="link" onClick={() => setChangePassword(true)}>
                                Quên mật khẩu?
                            </Button>
                        </div>

                        <Divider>Hoặc đăng nhập qua</Divider>

                        <div className="oauth-wrapper">
                            <Button
                                icon={<GithubOutlined />}
                                className="oauth-button github"
                                onClick={() =>
                                    (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/github`)
                                }
                            >
                                GitHub
                            </Button>
                            <Button
                                icon={<GoogleOutlined />}
                                className="oauth-button google"
                                onClick={() =>
                                    (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`)
                                }
                            >
                                Google
                            </Button>
                        </div>

                        <Divider />
                        <p className="register-text">
                            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                        </p>
                    </Form>
                </div>
            </div>

            <ModalChangePassword isModalOpen={changePassword} setIsModalOpen={setChangePassword} />
        </>
    );

};
export default LoginPage;
