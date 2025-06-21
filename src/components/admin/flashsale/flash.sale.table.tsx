import { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Tag, Tooltip, List, Typography, Popconfirm, Button } from "antd";
import { getAllFlashSalesAPI } from "@/services/api";
import CreateFlashSaleModal from "./create.flash.sale";
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import UpdateFlashSale from "./update.flash.sale";
interface IFlashSaleItem {
    id: number;
    productId: number;
    productName: string;
    originalPrice: number;
    salePrice: number;
    quantity: number;
}

interface IFlashSale {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    status: 'ACTIVE' | 'UPCOMING';
    createdAt?: string;
    items: IFlashSaleItem[];
}

interface IFlashSaleResponse {
    data: {
        result: IFlashSale[];
        meta: {
            total: number;
            current: number;
            pageSize: number;
        };
    };
    statusCode: number;
}

const FlashSaleTable = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });


    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IFlashSale | null>(null);

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<IFlashSale>[] = [
        {
            dataIndex: "index",
            valueType: "indexBorder",
            width: 48,
        },
        {
            title: "ID",
            dataIndex: "id",
            copyable: true,
        },
        {
            title: "Tên Flash Sale",
            dataIndex: "name",
        },
        {
            title: "Số sản phẩm",
            dataIndex: "items",
            render: (_, record) => `${record.items.length} sản phẩm`,
        },
        {
            title: "Chi tiết sản phẩm",
            dataIndex: "items_detail",
            render: (_, record) => (
                <Tooltip
                    placement="topLeft"
                    title={
                        <List
                            size="small"
                            dataSource={record.items}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text>
                                        {item.productName} - {item.salePrice.toLocaleString()}đ ({item.quantity} sp)
                                    </Typography.Text>
                                </List.Item>
                            )}
                        />
                    }
                >
                    <a>Xem chi tiết</a>
                </Tooltip>
            ),
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "startTime",
            valueType: "dateTime",
        },
        {
            title: "Thời gian kết thúc",
            dataIndex: "endTime",
            valueType: "dateTime",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (val) =>
                val === "ACTIVE" ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : (
                    <Tag color="orange">Sắp diễn ra</Tag>
                ),
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            // onConfirm={() => handleDeleteUser(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        // okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        },
    ];

    return (
        <>
            <ProTable<IFlashSale>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                rowKey="id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => (
                        <div>
                            {range[0]}-{range[1]} trên {total} rows
                        </div>
                    ),
                }}
                request={async (params) => {
                    const query = `current=${params.current}&pageSize=${params.pageSize}`;
                    const res = await getAllFlashSalesAPI(query);
                    const responseData = res.data;

                    setMeta(responseData.meta);
                    return {
                        data: responseData.result,
                        success: true,
                        total: responseData.meta.total,
                    };
                }}
                search={false}
                headerTitle="Danh sách Flash Sale"
                toolBarRender={() => [
                    // <CSVLink
                    //     data={currentDataTable}
                    //     filename='export-user.csv'
                    // >
                    //     <Button
                    //         icon={<ExportOutlined />}
                    //         type="primary"
                    //     >
                    //         Export
                    //     </Button>
                    // </CSVLink>
                    // ,

                    // <Button
                    //     icon={<CloudUploadOutlined />}
                    //     type="primary"
                    //     onClick={() => setOpenModalImport(true)}
                    // >
                    //     Import
                    // </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />

            <CreateFlashSaleModal
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateFlashSale
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default FlashSaleTable;
