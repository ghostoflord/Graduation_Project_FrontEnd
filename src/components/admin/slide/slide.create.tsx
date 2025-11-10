import { useState } from "react";
import {
    App,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Button,
    Switch,
    InputNumber,
    Upload,
    Image
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import type { UploadFile, RcFile } from "antd/es/upload";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { createSlideAPI } from "@/services/api";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

export type SlideType = "HOME" | "ABOUT" | "CONTACT";

export interface ISlideForm {
    title: string;
    description?: string;
    imageUrl?: string;
    redirectUrl?: string;
    active: boolean;
    orderIndex: number;
    type: SlideType;
}

const CreateSlide = ({ openModalCreate, setOpenModalCreate, refreshTable }: IProps) => {
    const [form] = Form.useForm<ISlideForm>();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const [imageFile, setImageFile] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    // convert file -> base64
    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    // xem trước ảnh
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.preview as string);
    };

    // xử lý upload (fake customRequest để AntD hoạt động mà ko upload thật)
    const handleUploadImage = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess } = options;
        const uploadedFile: UploadFile = {
            uid: (file as RcFile).uid,
            name: (file as RcFile).name,
            status: "done",
            originFileObj: file as RcFile
        };
        setImageFile(uploadedFile);
        await handlePreview(uploadedFile);
        setTimeout(() => {
            onSuccess?.("ok", uploadedFile as any);
        }, 100);
    };

    const onFinish: FormProps<ISlideForm>["onFinish"] = async (values) => {
        setIsSubmit(true);
        try {
            // convert ảnh sang base64
            const imageUrl = imageFile
                ? await getBase64(imageFile.originFileObj as RcFile)
                : "";

            const payload = {
                ...values,
                imageUrl,
                orderIndex: Number(values.orderIndex),
            };
            const res = await createSlideAPI(payload);

            if (res?.data) {
                message.success("Tạo mới slide thành công");
                form.resetFields();
                setImageFile(null);
                setPreviewImage("");
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: res?.message || "Không thể tạo slide",
                });
            }
        } catch (err) {
            notification.error({
                message: "Lỗi gửi yêu cầu",
                description: String(err),
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
                setImageFile(null);
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
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề slide!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    label="Loại slide"
                    name="type"
                    rules={[{ required: true, message: "Vui lòng chọn loại slide!" }]}
                >
                    <Select placeholder="Chọn loại slide">
                        <Select.Option value="HOME">Homepage</Select.Option>
                        <Select.Option value="ABOUT">About</Select.Option>
                        <Select.Option value="CONTACT">Contact</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Link chuyển hướng" name="redirectUrl">
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Thứ tự hiển thị"
                    name="orderIndex"
                    rules={[{ required: true, message: "Vui lòng nhập thứ tự hiển thị!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
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
                    label="Ảnh slide"
                    name="imageUrl"
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
                        }}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
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
