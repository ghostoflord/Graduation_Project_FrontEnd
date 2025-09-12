import { useState } from 'react';
import { App, Divider, Form, Input, Modal, Select, Button, Switch, InputNumber, Image } from 'antd';
import type { FormProps } from 'antd';
import { createSlideAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

export type SlideType = 'HOME' | 'ABOUT' | 'CONTACT';

export interface ISlideForm {
    title: string;
    description?: string;
    imageUrl: string;
    redirectUrl?: string;
    active: boolean;
    orderIndex: number;
    type: SlideType;
}

const CreateSlide = ({ openModalCreate, setOpenModalCreate, refreshTable }: IProps) => {
    const [form] = Form.useForm<ISlideForm>();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [previewImage, setPreviewImage] = useState<string>("");

    const onFinish: FormProps<ISlideForm>['onFinish'] = async (values) => {
        console.log('Form values:', values); // xem tất cả các field
        setIsSubmit(true);
        try {
            const payload = {
                ...values,
                orderIndex: Number(values.orderIndex), // đảm bảo là số
                type: values.type, // check xem backend chấp nhận 'HOME' hay 'HOMEPAGE'
            };
            console.log('Payload gửi API:', payload);
            const res = await createSlideAPI(payload);
            console.log('Response API:', res.data);
            if (res.data) {
                message.success('Tạo mới slide thành công');
                form.resetFields();
                setPreviewImage("");
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res?.message || 'Không thể tạo slide'
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
            title="Thêm mới Slide"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
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
                name="create-slide"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề slide!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    label="Loại slide"
                    name="type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại slide!' }]}
                >
                    <Select placeholder="Chọn loại slide">
                        <Select.Option value="HOME">Homepage</Select.Option>
                        <Select.Option value="ABOUT">ABOUT</Select.Option>
                        <Select.Option value="CONTACT">CONTACT</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Link chuyển hướng"
                    name="redirectUrl"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Thứ tự hiển thị"
                    name="orderIndex"
                    rules={[{ required: true, message: 'Vui lòng nhập thứ tự hiển thị!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Kích hoạt"
                    name="active"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    label="URL ảnh slide"
                    name="imageUrl"
                    rules={[{ required: true, message: "Vui lòng nhập URL ảnh slide!" }]}
                >
                    <Input
                        placeholder="https://example.com/your-image.jpg"
                        onChange={(e) => setPreviewImage(e.target.value)}
                    />
                </Form.Item>

                {previewImage && (
                    <Image
                        width={150}
                        src={previewImage}
                        style={{ marginTop: 10, borderRadius: 4 }}
                        preview={false}
                    />
                )}
            </Form>
        </Modal>
    );
};

export default CreateSlide;
