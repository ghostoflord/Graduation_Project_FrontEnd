import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd";
import { updateProductDetailAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: ProductDetail | null) => void;
    dataUpdate: ProductDetail | null;
}

type FieldType = ProductDetail;

const UpdateProductDetail = ({
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate
}: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue(dataUpdate);
        }
    }, [dataUpdate]);

    const handleCancel = () => {
        form.resetFields();
        setDataUpdate(null);
        setOpenModalUpdate(false);
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true);
        try {
            const res = await updateProductDetailAPI(values.id!, values);
            if (res && res.data) {
                message.success("Cập nhật chi tiết sản phẩm thành công");
                handleCancel();
                refreshTable();
            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: res.message || "Không rõ nguyên nhân",
                });
            }
        } catch (err) {
            notification.error({
                message: "Lỗi khi cập nhật",
                description: (err as any)?.message || "Không rõ nguyên nhân"
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật chi tiết sản phẩm"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
            width={800}
        >
            <Divider />
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item label="CPU" name="cpu" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="RAM" name="ram" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Storage" name="storage" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="GPU" name="gpu" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Màn hình" name="screen" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Pin" name="battery" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Trọng lượng" name="weight" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Chất liệu" name="material" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Hệ điều hành" name="os" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Tính năng đặc biệt" name="specialFeatures" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Cổng kết nối" name="ports" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="ID sản phẩm" name="productId" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProductDetail;
