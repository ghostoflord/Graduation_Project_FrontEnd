// src/pages/admin/flashsale/CreateFlashSaleModal.tsx

import { useEffect, useState } from "react";
import {
    App,
    Button,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Table,
} from "antd";
import type { FormProps } from "antd";
import { createFlashSaleAPI, getProductsAPI } from "@/services/api";

interface IProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    refreshTable: () => void;
}

const CreateFlashSaleModal = ({ open, setOpen, refreshTable }: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [items, setItems] = useState<IFlashSaleItemRequest[]>([]);
    const [products, setProducts] = useState<IProductTable[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProductsAPI("page=1&limit=100");
                if (res.data?.result) {
                    setProducts(res.data.result);
                }
            } catch (err) {
                notification.error({
                    message: "Lỗi khi tải sản phẩm",
                    description: String(err),
                });
            }
        };

        fetchProducts();
    }, []);

    const addItem = (item: IFlashSaleItemRequest) => {
        setItems((prev) => [...prev, item]);
    };

    const resetAll = () => {
        form.resetFields();
        setItems([]);
        setOpen(false);
    };

    const onFinish: FormProps<any>["onFinish"] = async (values) => {
        const payload: IFlashSaleRequest = {
            name: values.name,
            startTime: values.time[0].toISOString(),
            endTime: values.time[1].toISOString(),
            items,
        };

        setIsSubmit(true);
        try {
            const res = await createFlashSaleAPI(payload);
            if (res && res.statusCode === 200) {
                message.success("Tạo Flash Sale thành công!");
                resetAll();
                refreshTable();
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res.message || "Không tạo được chương trình",
                });
            }
        } catch (err) {
            notification.error({
                message: "Lỗi server",
                description: String(err),
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Tạo Flash Sale"
            open={open}
            onCancel={resetAll}
            onOk={() => form.submit()}
            confirmLoading={isSubmit}
            okText="Tạo mới"
            cancelText="Hủy"
            width={800}
        >
            <Divider />
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Tên chương trình"
                    rules={[{ required: true, message: "Vui lòng nhập tên chương trình!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="time"
                    label="Khoảng thời gian"
                    rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
                >
                    <DatePicker.RangePicker showTime style={{ width: "100%" }} />
                </Form.Item>
            </Form>

            <Divider>Thêm sản phẩm Flash Sale</Divider>
            <Form
                layout="inline"
                onFinish={(values) => {
                    addItem({
                        productId: Number(values.productId),
                        salePrice: values.salePrice,
                        quantity: values.quantity,
                    });
                    form.resetFields(["productId", "salePrice", "quantity"]);
                }}
            >
                <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="Chọn sản phẩm"
                        showSearch
                        optionFilterProp="label"
                        options={(products || []).map((product) => ({
                            label: product.name,
                            value: product.id,
                        }))}
                    />
                </Form.Item>
                <Form.Item name="salePrice" label="Giá khuyến mãi" rules={[{ required: true }]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Thêm</Button>
                </Form.Item>
            </Form>

            <Table
                dataSource={items}
                className="mt-4"
                rowKey={(r) => r.productId}
                pagination={false}
                size="small"
                columns={[
                    {
                        title: "Sản phẩm",
                        dataIndex: "productId",
                        render: (id) => products.find((p) => p.id === id)?.name || id,
                    },
                    { title: "Giá Sale", dataIndex: "salePrice" },
                    { title: "Số lượng", dataIndex: "quantity" },
                ]}
            />
        </Modal>
    );
};

export default CreateFlashSaleModal;
