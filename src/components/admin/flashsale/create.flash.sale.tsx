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
    List,
    Modal,
    Select,
    Table,
} from "antd";
import type { FormProps } from "antd";
import { createFlashSaleAPI, getProductsAPI } from "@/services/api";
import type { Dayjs } from "dayjs";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type ProductOption = Pick<IProductTable, "id" | "name">;

interface IFlashSaleItemRequest {
    productId: number;
    salePrice: number;
    quantity: number;
}

interface IFlashSaleRequest {
    name: string;
    startTime: string;
    endTime: string;
    items: IFlashSaleItemRequest[];
}

type FieldType = {
    name: string;
    time?: [Dayjs, Dayjs];
};

const CreateFlashSaleModal = ({
    openModalCreate,
    setOpenModalCreate,
    refreshTable,
}: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const [products, setProducts] = useState<ProductOption[]>([]);
    const [items, setItems] = useState<IFlashSaleItemRequest[]>([]);

    // State quản lý input thêm sản phẩm
    const [selectedProductId, setSelectedProductId] = useState<number | undefined>();
    const [salePrice, setSalePrice] = useState<number | undefined>();
    const [quantity, setQuantity] = useState<number | undefined>();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProductsAPI("page=1&limit=100");
                if (res.data?.result) {
                    const mappedProducts = res.data.result.map((product) => ({
                        id: product.id,
                        name: product.name,
                    }));
                    setProducts(mappedProducts);
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

    // Thêm item vào state
    const handleAddItem = () => {
        if (!selectedProductId || !salePrice || !quantity) {
            message.error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }

        setItems((prev) => [
            ...prev,
            {
                productId: selectedProductId,
                salePrice,
                quantity,
            },
        ]);

        // reset input
        setSelectedProductId(undefined);
        setSalePrice(undefined);
        setQuantity(undefined);
    };

    // Submit tạo Flash Sale
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (items.length === 0) {
            message.error("Vui lòng thêm ít nhất 1 sản phẩm!");
            return;
        }

        const [start, end] = values.time || [];
        if (!start || !end) {
            message.error("Vui lòng chọn khoảng thời gian!");
            return;
        }

        const payload: IFlashSaleRequest = {
            name: values.name,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
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
        setSelectedProductId(undefined);
        setSalePrice(undefined);
        setQuantity(undefined);
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
            </Form>

            <Divider>Thêm sản phẩm Flash Sale</Divider>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <Select<number>
                    style={{ width: 200 }}
                    placeholder="Chọn sản phẩm"
                    value={selectedProductId}
                    onChange={(value) => setSelectedProductId(value)}
                    options={products.map((p) => ({ label: p.name, value: p.id }))}
                />
                <InputNumber
                    min={0}
                    placeholder="Giá khuyến mãi"
                    value={salePrice}
                    onChange={(value) => setSalePrice(value ?? undefined)}
                />
                <InputNumber
                    min={1}
                    placeholder="Số lượng"
                    value={quantity}
                    onChange={(value) => setQuantity(value ?? undefined)}
                />
                <Button type="primary" onClick={handleAddItem}>
                    Thêm
                </Button>
            </div>

            {/* Hiển thị danh sách các item đã thêm */}
            <List
                size="small"
                bordered
                dataSource={items}
                renderItem={(item) => (
                    <List.Item>
                        {products.find((p) => p.id === item.productId)?.name} -{" "}
                        {item.salePrice.toLocaleString()}đ ({item.quantity} sp)
                    </List.Item>
                )}
            />

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
        </Modal>
    );
};

export default CreateFlashSaleModal;
