import { useState } from 'react';
import { Modal, Form, Input, Upload, Button, Image, App, Divider, Select, InputNumber } from 'antd';
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
    sold: string;
    bestsell: string;
    sell: string;
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
        console.log('🎯 Form values:', values);
        setIsSubmit(true);
        const { name, productCode, price, detailDescription, guarantee, factory, shortDescription, quantity, bestsell, sell, sold } = values;
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
                imageUrl,         // ảnh đúng vị trí
                factory,
                price,
                sold,
                quantity,
                shortDescription,
                bestsell,
                sell
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
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mã Sản Phẩm"
                    name="productCode"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Miêu Tả Chi Tiết"
                    name="detailDescription"
                    rules={[{ required: true, message: 'Vui lòng nhập miêu tả sản phẩm!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mô Tả Ngắn"
                    name="shortDescription"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Nhà Máy"
                    name="factory"
                    rules={[{ required: true, message: 'Vui lòng nhập nhà máy!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Đã Bán"
                    name="sold"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng đã bán!' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Số Lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm!' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Trạng Thái"
                    name="guarantee"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái hàng hóa!' }]}
                >
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
                        formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        addonAfter=" đ"
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Phân loại nổi bật"
                    name="bestsell"
                    rules={[{ required: true, message: 'Vui lòng chọn phân loại!' }]}
                >
                    <Select placeholder="Chọn phân loại nổi bật">
                        <Select.Option value="NONE">Không nổi bật</Select.Option>
                        <Select.Option value="BESTSELLER">Bán chạy</Select.Option>
                        <Select.Option value="HOT">Hot</Select.Option>
                        <Select.Option value="FEATURED">Đặc sắc</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Giảm giá"
                    name="sell"
                    rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        step={1}
                        precision={0}
                        style={{ width: '100%' }}
                    // formatter={(value) => `${value}%`}
                    // parser={(value) => value?.replace(/[^\d]/g, '') || ''}
                    // addonAfter="%"
                    />
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

export default CreateProduct;
