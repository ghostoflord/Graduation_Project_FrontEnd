import { useEffect, useState } from "react";
import {
    App,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Switch,
    InputNumber,
    Image,
} from "antd";
import type { FormProps } from "antd";
import { updateSlideAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: ISlide | null) => void;
    dataUpdate: ISlide | null;
}

type FieldType = {
    id: number;
    title: string;
    description?: string;
    imageUrl: string;
    redirectUrl?: string;
    active: boolean;
    orderIndex: number;
    type: string;
};

const UpdateSlide = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate,
    } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.resetFields();
            form.setFieldsValue({
                id: dataUpdate.id,
                title: dataUpdate.title,
                description: dataUpdate.description,
                imageUrl: dataUpdate.imageUrl,
                redirectUrl: dataUpdate.redirectUrl,
                active: dataUpdate.active,
                orderIndex: dataUpdate.orderIndex,
                type: dataUpdate.type,
            });
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (!dataUpdate) return;
        setIsSubmit(true);
        try {
            const res = await updateSlideAPI(dataUpdate.id, values);
            if (res && res.data) {
                message.success("Cập nhật slide thành công");
                form.resetFields();
                setOpenModalUpdate(false);
                setDataUpdate(null);
                refreshTable();
            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: (res as any)?.message,
                });
            }
        } catch (e: any) {
            notification.error({
                message: "Lỗi hệ thống",
                description: e.message,
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Cập nhật slide"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                name="form-update-slide"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item<FieldType> hidden label="id" name="id">
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Mô tả" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Ảnh (link)"
                    name="imageUrl"
                    rules={[{ required: true, message: "Vui lòng nhập link ảnh!" }]}
                >
                    <Input />
                </Form.Item>

                {form.getFieldValue("imageUrl") && (
                    <Image
                        width={120}
                        src={form.getFieldValue("imageUrl")}
                        style={{ marginBottom: 16, borderRadius: 4 }}
                        preview
                    />
                )}

                <Form.Item<FieldType> label="Đường dẫn" name="redirectUrl">
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Trạng thái"
                    name="active"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Thứ tự"
                    name="orderIndex"
                    rules={[{ required: true, message: "Nhập thứ tự hiển thị!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Loại"
                    name="type"
                    rules={[{ required: true, message: "Vui lòng nhập type!" }]}
                >
                    <Select placeholder="Chọn type">
                        <Select.Option value="HOME">HOME</Select.Option>
                        <Select.Option value="BANNER">BANNER</Select.Option>
                        {/* Thêm các type khác nếu cần */}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateSlide;
