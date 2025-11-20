import { useEffect, useState } from 'react';
import {
    App,
    Divider,
    Form,
    Input,
    Modal,
    DatePicker,
    InputNumber,
    Button,
    Space,
    Select,
    notification,
    Tooltip,
    Typography
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getProductsAPI, updateFlashSaleAPI } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: any | null) => void;
    dataUpdate: any | null;
}

interface ProductInfo {
    id: number;
    name: string;
    price: number; // Giá gốc
    quantity: number; // Tồn kho
    // ... các trường khác
}

const UpdateFlashSale = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate
    } = props;

    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();

    const [productList, setProductList] = useState<ProductInfo[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: ProductInfo }>({});

    const fetchProducts = async () => {
        setLoadingProducts(true);
        const res = await getProductsAPI("page=1&pageSize=100");
        if (res && res.data?.result) {
            setProductList(res.data.result);
        }
        setLoadingProducts(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (dataUpdate) {
            const items = dataUpdate.items?.map((item: any) => ({
                id: item.id,
                productId: item.product?.id || item.productId,
                salePrice: item.salePrice,
                quantity: item.quantity
            })) || [];

            // Cập nhật selectedProducts từ dataUpdate
            const initialSelected: { [key: string]: ProductInfo } = {};
            items.forEach((item: any) => {
                const product = productList.find(p => p.id === item.productId);
                if (product) {
                    initialSelected[item.productId] = product;
                }
            });
            setSelectedProducts(initialSelected);

            form.setFieldsValue({
                name: dataUpdate.name || '',
                startTime: dataUpdate.startTime ? dayjs(dataUpdate.startTime) : null,
                endTime: dataUpdate.endTime ? dayjs(dataUpdate.endTime) : null,
                status: dataUpdate.status || 'INACTIVE',
                items: items
            });
        }
    }, [dataUpdate, productList]);

    // Hàm xử lý khi chọn sản phẩm
    const handleProductSelect = (value: number, fieldIndex: number) => {
        const selectedProduct = productList.find(p => p.id === value);
        if (selectedProduct) {
            setSelectedProducts(prev => ({
                ...prev,
                [fieldIndex]: selectedProduct
            }));

            // Gợi ý giá sale (ví dụ: 80% giá gốc)
            const suggestedSalePrice = Math.round(selectedProduct.price * 0.8);
            const currentItems = form.getFieldValue('items') || [];

            if (currentItems[fieldIndex]) {
                form.setFieldValue(['items', fieldIndex, 'salePrice'], suggestedSalePrice);

                // Gợi ý số lượng tối đa bằng quantity
                const suggestedQuantity = Math.min(selectedProduct.quantity, 100); // Giới hạn tối đa 100
                form.setFieldValue(['items', fieldIndex, 'quantity'], suggestedQuantity);
            }
        }
    };

    // Custom option renderer để hiển thị thông tin giá
    const renderProductOption = (product: ProductInfo) => {
        return (
            <Select.Option key={product.id} value={product.id} label={product.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>
                            {product.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            ID: {product.id} | Tồn kho: {product.quantity}
                        </div>
                    </div>
                    <div style={{ marginLeft: 8, textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, color: '#ff4d4f' }}>
                            {product.price.toLocaleString()}₫
                        </div>
                        <div style={{ fontSize: 12, color: '#52c41a' }}>
                            Sale: {Math.round(product.price * 0.8).toLocaleString()}₫
                        </div>
                    </div>
                </div>
            </Select.Option>
        );
    };

    return (
        <Modal
            title="Cập nhật Flash Sale"
            open={openModalUpdate}
            onOk={async () => {
                try {
                    const values = await form.validateFields();

                    const payload: FlashSaleUpdateDTO = {
                        name: values.name || '',
                        startTime: values.startTime ? values.startTime.format('YYYY-MM-DDTHH:mm:ss') : '',
                        endTime: values.endTime ? values.endTime.format('YYYY-MM-DDTHH:mm:ss') : '',
                        status: values.status || 'INACTIVE',
                        items: values.items || []
                    };

                    setIsSubmit(true);
                    const res = await updateFlashSaleAPI(dataUpdate.id, payload);
                    if (res.statusCode === 200 || res?.data?.statusCode === 200) {
                        message.success('Cập nhật Flash Sale thành công');
                        refreshTable();
                        form.resetFields();
                        setOpenModalUpdate(false);
                        setDataUpdate(null);
                        setSelectedProducts({});
                    }
                } catch (error: any) {
                    notification.error({
                        message: 'Cập nhật thất bại',
                        description: error?.response?.data?.message || 'Lỗi không xác định'
                    });
                } finally {
                    setIsSubmit(false);
                }
            }}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
                setSelectedProducts({});
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
            width={800}
        >
            <Divider />
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Tên Flash Sale" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="ACTIVE">ACTIVE</Select.Option>
                        <Select.Option value="ENDED">ENDED</Select.Option>
                        <Select.Option value="UPCOMING">UPCOMING</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="startTime" label="Thời gian bắt đầu" rules={[{ required: true }]}>
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="endTime" label="Thời gian kết thúc" rules={[{ required: true }]}>
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.List name="items">
                    {(fields, { add, remove }) => (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <Typography.Text strong>Danh sách sản phẩm Flash Sale</Typography.Text>
                                <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                                    (Giá sale đề xuất = 80% giá gốc)
                                </Typography.Text>
                            </div>

                            {fields.map(({ key, name, ...restField }) => {
                                const selectedProduct = selectedProducts[name];

                                return (
                                    <div key={key} style={{
                                        border: '1px solid #d9d9d9',
                                        borderRadius: 6,
                                        padding: 12,
                                        marginBottom: 12,
                                        backgroundColor: '#fafafa'
                                    }}>
                                        <Space align="start" style={{ display: 'flex', width: '100%' }}>
                                            {/* Hidden ID field */}
                                            <Form.Item {...restField} name={[name, 'id']} hidden>
                                                <Input />
                                            </Form.Item>

                                            {/* Select sản phẩm */}
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'productId']}
                                                rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                                                style={{ marginBottom: 8 }}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Chọn sản phẩm"
                                                    optionFilterProp="label"
                                                    loading={loadingProducts}
                                                    allowClear
                                                    style={{ width: 300 }}
                                                    dropdownMatchSelectWidth={false}
                                                    onSelect={(value) => handleProductSelect(value, name)}
                                                    filterOption={(input, option) =>
                                                        option?.label.toLowerCase().includes(input.toLowerCase()) || false
                                                    }
                                                >
                                                    {productList.map((product) => renderProductOption(product))}
                                                </Select>
                                            </Form.Item>

                                            {/* Thông tin sản phẩm đã chọn */}
                                            {selectedProduct && (
                                                <div style={{ flex: 1, padding: '8px 12px', backgroundColor: 'white', borderRadius: 4 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 500 }}>{selectedProduct.name}</div>
                                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                                Giá gốc: <span style={{ textDecoration: 'line-through' }}>
                                                                    {selectedProduct.price.toLocaleString()}₫
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Tooltip title={`Tồn kho: ${selectedProduct.quantity}`}>
                                                            <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => {
                                                    // Xóa khỏi selectedProducts
                                                    setSelectedProducts(prev => {
                                                        const newSelected = { ...prev };
                                                        delete newSelected[name];
                                                        return newSelected;
                                                    });
                                                    remove(name);
                                                }}
                                            />
                                        </Space>

                                        {/* Input giá và số lượng */}
                                        <Space style={{ marginTop: 8, width: '100%' }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'salePrice']}
                                                label="Giá sale"
                                                rules={[
                                                    { required: true, message: 'Giá sale không được để trống!' },
                                                    { type: 'number', min: 1, message: 'Giá sale phải lớn hơn 0!' },
                                                ]}
                                            >
                                                <InputNumber
                                                    placeholder="Giá sale"
                                                    min={1}
                                                    style={{ width: 150 }}
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
                                                    addonAfter="₫"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'quantity']}
                                                label="Số lượng"
                                                rules={[
                                                    { required: true, message: 'Số lượng không được để trống!' },
                                                    { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
                                                ]}
                                            >
                                                <InputNumber
                                                    placeholder="Số lượng"
                                                    min={1}
                                                    style={{ width: 120 }}
                                                    max={selectedProduct?.quantity || 1000}
                                                />
                                            </Form.Item>

                                            {selectedProduct && (
                                                <Form.Item label="Khuyến nghị">
                                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                        Nên nhập: {Math.round(selectedProduct.price * 0.8).toLocaleString()}₫
                                                    </Typography.Text>
                                                </Form.Item>
                                            )}
                                        </Space>
                                    </div>
                                );
                            })}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={() => add()}
                                    block
                                >
                                    Thêm sản phẩm
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default UpdateFlashSale;