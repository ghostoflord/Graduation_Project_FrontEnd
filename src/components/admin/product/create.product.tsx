import { useState } from 'react';
import { Modal, Form, Input, Upload, Button, Image, App, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileAPI, createProductAPI } from '@/services/api';
import { UploadFile, RcFile } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { FormProps } from 'antd/lib';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    productCode: string;
    price: string;
    detailDescription: string;
    guarantee: string;
    factory: string;
    shortDescription: string;
    image: UploadFile[];
    quantity: string;
};

const CreateProduct = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [imageFile, setImageFile] = useState<UploadFile | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    const normFile = (e: any) => {
        return Array.isArray(e) ? e : e?.fileList;
    };

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
        setPreviewImage(file.preview as string);
    };

    const handleUploadImage = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            // Upload product image to backend and get file name
            const res = await uploadFileAPI(file as File, "products");

            if (res && res.data) {
                const uploadedUrl = `${import.meta.env.VITE_BACKEND_URL}/upload/products/${res.data.fileName}`;
                const uploadedFile: UploadFile = {
                    uid: (file as RcFile).uid,
                    name: res.data.fileName,
                    status: 'done',
                    url: uploadedUrl,
                    thumbUrl: uploadedUrl,
                    originFileObj: file as RcFile
                };

                setImageFile(uploadedFile);
                await handlePreview(uploadedFile);

                setTimeout(() => {
                    onSuccess?.("ok", uploadedFile as any);
                }, 100);
            } else {
                onError?.(new Error(res?.message || "Upload failed"));
            }
        } catch (err: any) {
            onError?.(err);
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { name, productCode, price, detailDescription, guarantee, factory, shortDescription, quantity } = values;
        // Lấy base64 từ avatar file
        const imageUrl = imageFile
            ? await getBase64(imageFile.originFileObj as RcFile)
            : '';
        try {
            const res = await createProductAPI(
                name,
                productCode,
                detailDescription,
                guarantee,
                imageUrl,  // Gửi URL ảnh sản phẩm
                factory,
                price,
                quantity,
                shortDescription
            );

            if (res && res.data) {
                message.success('Tạo mới sản phẩm thành công');
                form.resetFields();
                setImageFile(null);
                setPreviewImage("");
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message
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
            title="Thêm mới sản phẩm"
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
                name="create-product"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Tên Sản Phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mã Sản Phẩm"
                    name="productCode"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}>
                    <Input type="number" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Miêu Tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập miêu tả sản phẩm!' }]}>
                    <Input.TextArea />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Bảo Hành"
                    name="guarantee"
                    rules={[{ required: true, message: 'Vui lòng nhập thông tin bảo hành!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Nhà Máy"
                    name="factory"
                    rules={[{ required: true, message: 'Vui lòng nhập nhà máy!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mô Tả Ngắn"
                    name="shortDescription"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Số Lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm!' }]}>
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Ảnh sản phẩm"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Vui lòng chọn ảnh sản phẩm!" }]}>
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
                        accept="image/*">
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

export default CreateProduct;
