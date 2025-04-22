import { useEffect, useState } from 'react';
import { App, Divider, Form, Input, InputNumber, Modal, Select } from 'antd';
import type { FormProps } from 'antd';
import { updateProductAPI, updateUserAPI } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IProductTable | null) => void;
    dataUpdate: IProductTable | null;
}

type FieldType = {
    id: string,
    name: string;
    productCode: string;
    detailDescription: string;
    guarantee: string;
    factory: string;
    // image: UploadFile[];  // Chứa thông tin avatar
    price: string;
    sold: string;
    quantity: string;
    shortDescription: string;
};

const UpdateProduct = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable,
        setDataUpdate, dataUpdate
    } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    // https://ant.design/components/form#components-form-demo-control-hooks
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                name: dataUpdate.name,
                productCode: dataUpdate.productCode,
                detailDescription: dataUpdate.detailDescription,
                guarantee: dataUpdate.guarantee,
                factory: dataUpdate.factory,
                price: dataUpdate.price,
                sold: dataUpdate.sold,
                quantity: dataUpdate.quantity,
                shortDescription: dataUpdate.shortDescription,
            })
        }
    }, [dataUpdate])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { id, name, productCode, detailDescription, guarantee, factory, price, sold, quantity, shortDescription } = values;
        setIsSubmit(true)
        const res = await updateProductAPI(id, name, productCode, detailDescription, guarantee, factory, price, sold, quantity, shortDescription);
        if (res && res.data) {
            message.success('Cập nhật product thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    return (
        <>

            <Modal
                title="Cập nhật sản phẩm"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-update"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        hidden
                        labelCol={{ span: 24 }}
                        label="id"
                        name="id"
                        rules={[
                            { required: true, message: 'Vui lòng nhập id!' },

                        ]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Ten"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập ten !' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Guarantee"
                        name="guarantee"
                        rules={[{ required: true, message: 'Vui lòng chọn guarantee!' }]}
                    >
                        <Select
                            placeholder="Chọn guarantee"
                            allowClear
                            style={{ width: '100%' }}
                        >
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
                </Form>
            </Modal>
        </>
    );
};

export default UpdateProduct;