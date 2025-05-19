import { useState, useEffect } from 'react';
import { Modal, Form, Input, App, Divider, Select } from 'antd';
import { createProductDetailAPI, getProductsAPI } from '@/services/api';

interface ProductDetail {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    screen: string;
    battery: string;
    weight: string;
    material: string;
    os: string;
    specialFeatures: string;
    ports: string;
    productId: string;
}

interface ProductOption {
    id: string;
    name: string;
}

interface Props {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

const CreateProductDetail = ({ openModalCreate, setOpenModalCreate, refreshTable }: Props) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const { message, notification } = App.useApp();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProductsAPI();
                console.log('API response from getProductsAPI:', res);
                const products = res?.data.result;
                console.log('Extracted products:', products);

                if (Array.isArray(products)) {
                    setProductOptions(
                        products.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                        }))
                    );
                } else {
                    notification.error({
                        message: 'Lỗi định dạng dữ liệu',
                        description: 'Danh sách sản phẩm không hợp lệ.',
                    });
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi tải danh sách sản phẩm',
                    description: String(error),
                });
            }
        };

        if (openModalCreate) {
            fetchProducts();
        }
    }, [openModalCreate]);

    const onFinish = async (values: ProductDetail) => {
        console.log('Form values on submit:', values); // <-- log form data trước khi gửi API
        setIsSubmit(true);
        try {
            const res = await createProductDetailAPI(values);
            if (res?.data) {
                message.success('Tạo chi tiết sản phẩm thành công');
                form.resetFields();
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message,
                });
            }
        } catch (err: any) {
            notification.error({
                message: 'Không thể tạo chi tiết sản phẩm',
                description: err?.response?.data?.message || String(err),
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Thêm chi tiết sản phẩm"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
            }}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                layout="vertical"
                name="create-product-detail"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="productId"
                    label="Sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
                >
                    <Select
                        placeholder="Chọn sản phẩm"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={productOptions.map((p) => ({
                            label: p.name,
                            value: p.id,
                        }))}
                    />
                </Form.Item>

                {[
                    { name: 'cpu', label: 'CPU' },
                    { name: 'ram', label: 'RAM' },
                    { name: 'storage', label: 'Storage' },
                    { name: 'gpu', label: 'GPU' },
                    { name: 'screen', label: 'Màn hình' },
                    { name: 'battery', label: 'Pin' },
                    { name: 'weight', label: 'Trọng lượng' },
                    { name: 'material', label: 'Chất liệu' },
                    { name: 'os', label: 'Hệ điều hành' },
                    { name: 'specialFeatures', label: 'Tính năng đặc biệt' },
                    { name: 'ports', label: 'Cổng kết nối' },
                ].map(({ name, label }) => (
                    <Form.Item key={name} name={name} label={label} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    );
};

export default CreateProductDetail;
