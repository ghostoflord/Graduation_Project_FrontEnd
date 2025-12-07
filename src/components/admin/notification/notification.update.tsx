import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    App,
    Divider,
    Form,
    Input,
    Modal,
    Switch,
} from "antd";
import type { FormProps } from "antd";
import { updateNotificationAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: Dispatch<SetStateAction<INotification | null>>;
    dataUpdate: INotification | null;
}

type FieldType = {
    id: number;
    title: string;
    content: string;
    isRead: boolean;
    forAll: boolean;
};

const UpdateNotification = (props: IProps) => {
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
                content: dataUpdate.content,
                isRead: dataUpdate.isRead,
                forAll: dataUpdate.forAll,
            });
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true);

        const { id, title, content, isRead, forAll } = values;

        const res = await updateNotificationAPI(id, {
            title,
            content,
            isRead,
            forAll,
        });

        if (res && res?.statusCode === 200) {
            message.success("Cập nhật thông báo thành công");
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật thông báo"
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
                name="form-update-noti"
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

                <Form.Item<FieldType>
                    label="Nội dung"
                    name="content"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item<FieldType> label="Đã đọc" name="isRead" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item<FieldType> label="Cho tất cả" name="forAll" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateNotification;
