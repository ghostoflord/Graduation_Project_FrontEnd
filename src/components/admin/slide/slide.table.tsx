import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { useState, useRef, useEffect } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { Tag, App, Button, Popconfirm } from "antd";
import { PlusOutlined, DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { getSlidesByTypeAPI, deleteSlideAPI, getSlidesByAPI } from "@/services/api";
import CreateSlide from "./slide.create";
import UpdateSlide from "./slide.update";

export interface ISlide {
    id: number;
    title: string;
    description?: string;
    imageUrl: string;
    redirectUrl?: string;
    active: boolean;
    orderIndex: number;
    type: string;
    createdAt?: string;
    updatedAt?: string;
}

const TableSlide = () => {
    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [currentDataTable, setCurrentDataTable] = useState<ISlide[]>([]);
    const [loading, setLoading] = useState(false);
    const { message, notification } = App.useApp();

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<ISlide | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteSlide = async (id: number) => {
        setIsDeleting(true);
        try {
            const res = await deleteSlideAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa slide thành công');
                refreshTable();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa slide'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa slide'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const columns: ProColumns<ISlide>[] = [
        {
            title: "ID",
            dataIndex: "id",
            width: 60,
            render: (value) => (
                <span style={{ fontSize: 12, color: "#555" }}>{value}</span>
            ),
        },
        { title: "Title", dataIndex: "title" },
        { title: "Description", dataIndex: "description", ellipsis: true },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            render: (_, entity) => {
                const imageUrl = entity.imageUrl?.startsWith('http')
                    ? entity.imageUrl
                    : `${import.meta.env.VITE_BACKEND_URL}/upload/slides/${entity.imageUrl}`;
                return imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Slide Avatar"
                        style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <span>No Slide</span>
                );
            },
        },

        {
            title: "Redirect",
            dataIndex: "redirectUrl",
            render: (value) =>
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12 }}
                    >
                        {value}
                    </a>
                ) : (
                    "-"
                ),
        },
        {
            title: "Active",
            dataIndex: "active",
            render: (value) => (
                <Tag color={value ? "green" : "red"} style={{ fontSize: 12 }}>
                    {value ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Order",
            dataIndex: "orderIndex",
            width: 70,
            render: (value) => (
                <span style={{ fontSize: 12, color: "#555" }}>{value}</span>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            width: 80,
            render: (value) => (
                <span style={{ fontSize: 12 }}>{value}</span>
            ),
        },
        { title: "Created At", dataIndex: "createdAt", valueType: "dateTime" },
        { title: "Updated At", dataIndex: "updatedAt", valueType: "dateTime" },
        {
            title: "Action",
            width: 120,
            render: (_, record) => (
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setDataUpdate(record);
                            setOpenModalUpdate(true);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title="Xác nhận xóa slide"
                        description="Bạn có chắc chắn muốn xóa slide này?"
                        onConfirm={() => handleDeleteSlide(record.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ loading: isDeleting }}
                    >
                        <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: "pointer" }} />
                    </Popconfirm>
                </div>
            ),
        },
    ];


    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<ISlide>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey="id"
                request={async (params) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;

                    const filters: string[] = [];

                    if (params.name) {
                        filters.push(`name~'${params.name}'`);
                    }

                    if (params.email) {
                        filters.push(`email~'${params.email}'`);
                    }

                    if (params.address) {
                        filters.push(`address~'${params.address}'`);
                    }

                    if (params.gender) {
                        filters.push(`gender~'${params.gender}'`);
                    }

                    if (filters.length > 0) {
                        query += `&filter=${filters.join(" and ")}`;
                    }

                    const res = await getSlidesByAPI(query);
                    if (res.data) {

                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }


                    return {
                        data: res.data?.result,
                        page: params.current,
                        success: true,
                        total: res.data?.meta.total,
                    };
                }}
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                headerTitle="Table Slide"
                toolBarRender={() => [
                    <Button
                        key="add-slide"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                    >
                        Add new
                    </Button>,
                ]}
            />

            <CreateSlide
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateSlide
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TableSlide;
