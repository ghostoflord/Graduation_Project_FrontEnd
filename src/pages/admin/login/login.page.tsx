import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './login.page.scss';
import { useState } from 'react';
import type { FormProps } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import { loginAPI } from '@/services/api';

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);

        try {
            const res = await loginAPI(username, password);
            if (res?.data) {
                setIsAuthenticated(true);
                setUser(res.data.user);
                localStorage.setItem('access_token', res.data.access_token);
                message.success('Đăng nhập tài khoản thành công!');
                navigate('/');
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description:
                        res.message && Array.isArray(res.message) ? res.message[0] : res.message,
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
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Nhập</h2>
                            <Divider />
                        </div>

                        <Form name="login-form" onFinish={onFinish} autoComplete="off">
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="username"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: 'email', message: 'Email không đúng định dạng!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: 'center' }}>
                                Chưa có tài khoản?
                                <span>
                                    <Link to="/register"> Đăng Ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
