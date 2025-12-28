import { useState } from 'react';
import { App, Divider, Form, Input, Modal, Switch } from 'antd';
import type { FormProps } from 'antd';
import { createNotificationAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    title: string;
    content: string;
    userId?: number;
    forAll?: boolean;
};

const CreateNotification = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const forAll = Form.useWatch('forAll', form);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        try {
            const { title, content, userId, forAll } = values;

            console.log('📤 Dữ liệu gửi lên:');
            console.log('forAll:', forAll);
            console.log('userId:', userId);

            const res = await createNotificationAPI(
                title,
                content,
                forAll ? undefined : userId, // nếu isBroadcast thì không truyền userId
                forAll
            );

            if (res?.statusCode === 200) {
                message.success('Tạo thông báo thành công');
                form.resetFields();
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Tạo thông báo thất bại',
                    description: res?.message || res?.error || 'Lỗi không xác định'
                });
            }
        } catch (err: any) {
            notification.error({
                message: 'Lỗi gửi yêu cầu',
                description: err?.response?.data?.message || err?.message || 'Lỗi không xác định'
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Tạo thông báo mới"
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
                name="create-notification"
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{ isBroadcast: true }}
            >
                <Form.Item<FieldType>
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Nội dung"
                    name="content"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Gửi cho tất cả người dùng"
                    name="forAll"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item<FieldType>
                    label="User ID (nếu không gửi toàn bộ)"
                    name="userId"
                    dependencies={['forAll']} // Thêm dòng này
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (getFieldValue('forAll') || value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Vui lòng nhập userId nếu không gửi toàn bộ!')
                                );
                            },
                        }),
                    ]}
                >
                    <Input
                        type="number"
                        placeholder="Nhập ID người dùng cụ thể"
                        disabled={forAll}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateNotification;
