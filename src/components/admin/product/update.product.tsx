import { useEffect, useState } from "react";
import {
    App,
    Button,
    Divider,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Select,
    Upload
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type { FormProps } from "antd";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { updateProductAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IProductTable | null) => void;
    dataUpdate: IProductTable | null;
}

type FieldType = {
    id: string;
    name: string;
    productCode: string;
    detailDescription: string;
    guarantee: string;
    factory: string;
    price: string;
    sold: string;
    quantity: string;
    shortDescription: string;
    bestsell: string;
    sell: string;
    image?: UploadFile[];
};

const UpdateProduct = ({
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate
}: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [imageFile, setImageFile] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [imageBase64, setImageBase64] = useState<string>("");

    const normFile = (e: any) => Array.isArray(e) ? e : e?.fileList;

    // Đọc file thành base64
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

    // Thay vì upload file lên server, ta chỉ đọc base64 và lưu state
    const handleUploadImage = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            const base64 = await getBase64(file as RcFile);
            setImageBase64(base64);

            // Tạo fake UploadFile để hiển thị preview
            const uploadedFile: UploadFile = {
                uid: (file as RcFile).uid,
                name: (file as RcFile).name,
                status: "done",
                url: base64,
                thumbUrl: base64,
                originFileObj: file as RcFile
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
            form.setFieldsValue({ ...dataUpdate });
            if (dataUpdate.image) {
                // Ảnh cũ thì lấy url backend
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/upload/products/${dataUpdate.image}`;
                const file: UploadFile = {
                    uid: "-1",
                    name: dataUpdate.image,
                    status: "done",
                    url: imageUrl,
                    thumbUrl: imageUrl,
                };
                setImageFile(file);
                setPreviewImage(imageUrl);
                form.setFieldsValue({ image: [file] });

                // Ảnh cũ, chưa đổi, nên imageBase64 rỗng
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
        const {
            id,
            name,
            productCode,
            detailDescription,
            guarantee,
            factory,
            price,
            sold,
            quantity,
            shortDescription,
            bestsell,
            sell,
        } = values;

        setIsSubmit(true);

        // Gửi base64 ảnh nếu có, hoặc chuỗi rỗng nếu không đổi ảnh
        const imageToSend = imageBase64;

        const res = await updateProductAPI(
            id,
            name,
            productCode,
            detailDescription,
            guarantee,
            factory,
            price,
            sold,
            quantity,
            shortDescription,
            bestsell,
            sell,
            imageToSend
        );

        if (res && res.data) {
            message.success("Cập nhật sản phẩm thành công");
            handleCancel();
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message || "Không rõ nguyên nhân",
            });
        }

        setIsSubmit(false);
    };

    return (
        <Modal
            title="Cập nhật sản phẩm"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                <Form.Item<FieldType> name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Mã sản phẩm" name="productCode" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Chi tiết mô tả" name="detailDescription" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Bảo hành" name="guarantee" rules={[{ required: true }]}>
                    <Select placeholder="Chọn bảo hành">
                        <Select.Option value="IN_STOCK">IN STOCK</Select.Option>
                        <Select.Option value="OUT_OF_STOCK">OUT OF STOCK</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType> label="Nhà máy" name="factory" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Giá" name="price" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>

                <Form.Item<FieldType> label="Đã bán" name="sold" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>

                <Form.Item<FieldType> label="Số lượng" name="quantity" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>

                <Form.Item<FieldType> label="Mô tả ngắn" name="shortDescription" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Phân loại nổi bật"
                    name="bestsell"
                    rules={[{ required: true, message: "Vui lòng chọn phân loại!" }]}
                >
                    <Select placeholder="Chọn phân loại nổi bật">
                        <Select.Option value="NONE">Không nổi bật</Select.Option>
                        <Select.Option value="BESTSELLER">Bán chạy</Select.Option>
                        <Select.Option value="HOT">Hot</Select.Option>
                        <Select.Option value="FEATURED">Đặc sắc</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType> label="Số lượng" name="sell" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>

                <Form.Item
                    label="Ảnh sản phẩm"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Vui lòng chọn ảnh sản phẩm!" }]}
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
                        width={100}
                        src={previewImage}
                        style={{ marginTop: 10, borderRadius: 4 }}
                        preview={false}
                    />
                )}
            </Form>
        </Modal>
    );
};

export default UpdateProduct;
