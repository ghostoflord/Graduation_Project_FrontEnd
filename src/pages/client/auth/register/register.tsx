import { Button, Divider, Form, Input, App } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { registerAPI } from '@/services/api';
import loginBg from '@/assets/dang_nhap.png';

type FieldType = {
    name: string;
    email: string;
    password: string;
    address: string;
    age: string;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { email, name, password, address, age } = values;

        const res = await registerAPI(name, email, password, address, age);
        if (res.data) {
            message.success('Đăng ký user thành công. Vui lòng kiểm tra email để xác thực!');
            setTimeout(() => {
                navigate('/login');
            }, 1200);
        } else {
            message.error(res.message);
        }
        setIsSubmit(false);
    };

    return (
        <div
            className="register-page"
            style={{
                backgroundImage: `url(${loginBg})`,
            }}
        >
            <div className="register-overlay"></div>

            <div className="register-box">
                <h2 className="register-title">Đăng ký tài khoản</h2>
                <Divider />
                <Form name="form-register" onFinish={onFinish} autoComplete="off">
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Họ tên"
                        name="name"
                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
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

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmit} block>
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <Divider>Hoặc</Divider>
                    <p className="register-text">
                        Đã có tài khoản?
                        <Link to="/login"> Đăng nhập</Link>
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
