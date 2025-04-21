import { useState } from 'react';
import {
    App,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Upload,
    Button,
    Image,
    InputNumber
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import type { RcFile, UploadFile } from 'antd/es/upload';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { createProductAPI, uploadFileAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    email: string;
    productCode: string;
    detailDescription: string;
    guarantee: string;
    factory: string;
    image: UploadFile[];  // Chứa thông tin avatar
    price: string;
    sold: string;
    quantity: string;
    shortDescription: string;
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

    const handleUploadAvatar = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;

        try {
            // Upload avatar image to backend and get file name
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
        const { name, productCode, detailDescription, guarantee, image  , factory, price, sold, quantity, shortDescription } = values;

        // Chuyển avatar sang dạng base64
        const imageBase64 = imageFile ? await getBase64(imageFile.originFileObj as RcFile) : '';

        try {
            // Gọi API để tạo người dùng mới
            const res = await createProductAPI(name, productCode, detailDescription, guarantee, imageimageBase64, factory, price, sold, quantity, shortDescription);

            if (res && res.data) {
                message.success('Tạo mới user thành công');
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
            title="Thêm mới người dùng"
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
                name="create-user"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Name Product"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Product Code;"
                    name="productCode"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Detail Description;"
                    name="detailDescription"
                    rules={[{ required: true, message: 'Vui lòng nhập miêu tả sản phẩm!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Short Description"
                    name="shortDescription"
                    rules={[{ required: true, message: 'Vui lòng miêu tả ngắn về sản phẩm!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Factory"
                    name="factory"
                    rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Sold"
                    name="sold"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng đã bán!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng hàng hóa!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Guarantee"
                    name="guarantee"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái hàng hóa!' }]}>
                    <Select placeholder="Chọn trạng thái">
                        <Select.Option value="IN_STOCK">IN STOCK</Select.Option>
                        <Select.Option value="OUT_OF_STOCK">OUT OF STOCK</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Giá tiền"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                >
                    <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        addonAfter=" đ"
                    />
                </Form.Item>


                <Form.Item
                    label="Image"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Vui lòng chọn ảnh sản phẩm!" }]}>
                    <Upload
                        listType="picture"
                        maxCount={1}
                        customRequest={handleUploadAvatar}
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
