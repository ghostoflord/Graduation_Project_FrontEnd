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
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    time: [string, string];
    productId: number;
    salePrice: number;
    quantity: number;
};

const CreateFlashSaleModal = ({
    openModalCreate,
    setOpenModalCreate,
    refreshTable,
}: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [products, setProducts] = useState<IProductTable[]>([]);
    const [items, setItems] = useState<IFlashSaleItemRequest[]>([]);

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

    const handleAddItem = async (values: any) => {
        setItems((prev) => [
            ...prev,
            {
                productId: Number(values.productId),
                salePrice: values.salePrice,
                quantity: values.quantity,
            },
        ]);
        form.resetFields(["productId", "salePrice", "quantity"]);
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
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
                form.resetFields();
                setItems([]);
                setOpenModalCreate(false);
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

    const handleCancel = () => {
        setOpenModalCreate(false);
        form.resetFields();
        setItems([]);
    };

    return (
        <Modal
            title="Tạo chương trình Flash Sale"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
            width={800}
        >
            <Divider />
            <Form
                form={form}
                layout="vertical"
                name="create-flashsale"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Tên chương trình"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên chương trình!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Khoảng thời gian"
                    name="time"
                    rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian!" }]}
                >
                    <DatePicker.RangePicker showTime style={{ width: "100%" }} />
                </Form.Item>

                <Divider>Thêm sản phẩm Flash Sale</Divider>

                <Form.Item noStyle>
                    <Form
                        layout="inline"
                        onFinish={handleAddItem}
                        style={{ marginBottom: 16 }}
                    >
                        <Form.Item<FieldType>
                            name="productId"
                            label="Sản phẩm"
                            rules={[{ required: true, message: "Chọn sản phẩm!" }]}
                        >
                            <Select
                                style={{ width: 200 }}
                                placeholder="Chọn sản phẩm"
                                showSearch
                                optionFilterProp="label"
                                options={products.map((p) => ({
                                    label: p.name,
                                    value: p.id,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="salePrice"
                            label="Giá khuyến mãi"
                            rules={[{ required: true, message: "Nhập giá!" }]}
                        >
                            <InputNumber min={0} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="quantity"
                            label="Số lượng"
                            rules={[{ required: true, message: "Nhập số lượng!" }]}
                        >
                            <InputNumber min={1} />
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit">Thêm</Button>
                        </Form.Item>
                    </Form>
                </Form.Item>

                <Table
                    dataSource={items}
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
            </Form>
        </Modal>
    );
};

export default CreateFlashSaleModal;
