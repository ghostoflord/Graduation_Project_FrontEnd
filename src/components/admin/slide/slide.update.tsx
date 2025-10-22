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
    Upload,
    Button,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
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
    redirectUrl?: string;
    active: boolean;
    orderIndex: number;
    type: string;
    image?: UploadFile[];
};

const UpdateSlide = ({
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
}: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [imageFile, setImageFile] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [imageBase64, setImageBase64] = useState<string>("");

    const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string) || "");
    };

    const handleUploadImage = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            const base64 = await getBase64(file as RcFile);
            setImageBase64(base64);

            const uploadedFile: UploadFile = {
                uid: (file as RcFile).uid,
                name: (file as RcFile).name,
                status: "done",
                url: base64,
                thumbUrl: base64,
                originFileObj: file as RcFile,
            };
            setImageFile(uploadedFile);
            await handlePreview(uploadedFile);
            setTimeout(() => onSuccess?.("ok", uploadedFile as any), 100);
        } catch (err) {
            onError?.(err as Error);
        }
    };

    useEffect(() => {
        if (dataUpdate) {
            form.resetFields();
            form.setFieldsValue({
                id: dataUpdate.id,
                title: dataUpdate.title,
                description: dataUpdate.description,
                redirectUrl: dataUpdate.redirectUrl,
                active: dataUpdate.active,
                orderIndex: dataUpdate.orderIndex,
                type: dataUpdate.type,
            });

            if (dataUpdate.imageUrl) {
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/upload/slides/${dataUpdate.imageUrl}`;
                const file: UploadFile = {
                    uid: "-1",
                    name: dataUpdate.imageUrl,
                    status: "done",
                    url: imageUrl,
                    thumbUrl: imageUrl,
                };
                setImageFile(file);
                setPreviewImage(imageUrl);
                form.setFieldsValue({ image: [file] });
                setImageBase64("");
            } else {
                form.setFieldsValue({ image: [] });
                setImageFile(null);
                setPreviewImage("");
                setImageBase64("");
            }
        }
    }, [dataUpdate]);

    const handleCancel = () => {
        form.resetFields();
        setImageFile(null);
        setPreviewImage("");
        setImageBase64("");
        setDataUpdate(null);
        setOpenModalUpdate(false);
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (!dataUpdate) return;
        setIsSubmit(true);

        try {
            const payload = {
                title: values.title,
                description: values.description,
                redirectUrl: values.redirectUrl,
                active: values.active,
                orderIndex: values.orderIndex,
                type: values.type,
                imageBase64: imageBase64, // gửi ảnh base64
            };

            const res = await updateSlideAPI(dataUpdate.id, payload);
            if (res && res.data) {
                message.success("Cập nhật slide thành công");
                handleCancel();
                refreshTable();
            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: res?.message || "Không rõ nguyên nhân",
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
            onCancel={handleCancel}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                name="form-update-slide"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
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

                <Form.Item
                    label="Ảnh slide"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Vui lòng chọn ảnh slide!" }]}
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        customRequest={handleUploadImage}
                        fileList={imageFile ? [imageFile] : []}
                        onRemove={() => {
                            setImageFile(null);
                            setPreviewImage("");
                            setImageBase64("");
                        }}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>

                {previewImage && (
                    <Image
                        width={120}
                        src={previewImage}
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
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateSlide;
