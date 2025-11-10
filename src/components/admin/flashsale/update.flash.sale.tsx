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
    notification
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getProductsAPI, updateFlashSaleAPI } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: any | null) => void;
    dataUpdate: any | null;
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

    const [productList, setProductList] = useState<IProductTable[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

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
            form.setFieldsValue({
                name: dataUpdate.name || '',
                startTime: dataUpdate.startTime ? dayjs(dataUpdate.startTime) : null,
                endTime: dataUpdate.endTime ? dayjs(dataUpdate.endTime) : null,
                status: dataUpdate.status || 'INACTIVE',
                items: dataUpdate.items?.map((item: any) => ({
                    id: item.id,
                    productId: item.product?.id || item.productId,
                    salePrice: item.salePrice,
                    quantity: item.quantity
                })) || []
            });
        }
    }, [dataUpdate]);

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
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
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
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                    {/* Hidden ID field */}
                                    <Form.Item {...restField} name={[name, 'id']} hidden>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'productId']}
                                        rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Chọn sản phẩm"
                                            optionFilterProp="label"
                                            loading={loadingProducts}
                                            allowClear
                                            style={{ width: 220 }} // fix width cố định, ko bị giãn
                                            dropdownMatchSelectWidth={false} // dropdown dài tự nhiên, không bị cắt
                                        >
                                            {productList.map((product) => (
                                                <Select.Option
                                                    key={product.id}
                                                    value={product.id}
                                                    label={product.name}
                                                >
                                                    <div
                                                        style={{
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            whiteSpace: 'nowrap',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {`#${product.id} - ${product.name}`}
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>


                                    <Form.Item
                                        {...restField}
                                        name={[name, 'salePrice']}
                                        rules={[
                                            { required: true, message: 'Giá sale không được để trống!' },
                                            { type: 'number', min: 1, message: 'Giá sale phải lớn hơn 0!' },
                                        ]}
                                    >
                                        <InputNumber placeholder="Giá sale" min={1} />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'quantity']}
                                        rules={[
                                            { required: true, message: 'Số lượng không được để trống!' },
                                            { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
                                        ]}
                                    >
                                        <InputNumber placeholder="Số lượng" min={1} />
                                    </Form.Item>

                                    <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}

                                    />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button icon={<PlusOutlined />} onClick={() => add()}>
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
