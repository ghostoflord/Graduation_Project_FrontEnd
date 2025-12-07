import { DeleteOutlined, EditOutlined, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { callDeletePermission, callFetchPermissions } from "@/services/api";
import { colorMethod } from "@/utils/config";
import CreatePermission from "./create.permission";
import DetailPermission from "./detail.permission";
import UpdatePermission from "./update.permission";

const PermissionTable = () => {
    const actionRef = useRef<ActionType>();
    const tableRef = useRef<ActionType>();
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [currentDataTable, setCurrentDataTable] = useState<IPermission[]>([]);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IPermission | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IPermission | null>(null);

    const handleDeletePermission = async (id: string | undefined) => {
        if (id) {
            const res = await callDeletePermission(id);
            if (res && res.statusCode === 200) {
                message.success('Xóa Permission thành công');

                const newTotal = meta.total - 1;
                const totalPages = Math.ceil(newTotal / meta.pageSize);

                const newPage = meta.current > totalPages ? totalPages : meta.current;

                setMeta(prev => ({
                    ...prev,
                    total: newTotal,
                    current: newPage,
                }));

                tableRef.current?.reload?.(true);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error,
                });
            }
        }
    };


    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<IPermission>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                        href='#'>{entity.id}</a>
                )
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'API',
            dataIndex: 'apiPath',
            sorter: true,
        },
        {
            title: 'Method',
            dataIndex: 'method',
            sorter: true,
            render: (_, record) => (
                <p style={{
                    paddingLeft: 10,
                    fontWeight: 'bold',
                    marginBottom: 0,
                    color: colorMethod(record.method || '')
                }}>
                    {record.method}
                </p>
            )
        },
        {
            title: 'Module',
            dataIndex: 'module',
            sorter: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            hideInSearch: true,
            render: (_, record) => record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : "",
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            hideInSearch: true,
            render: (_, record) => record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : "",
        },
        {
            title: 'Actions',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => {
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
                            title="Xác nhận xóa permission?"
                            description="Bạn có chắc chắn muốn xóa permission này?"
                            onConfirm={() => handleDeletePermission(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            placement="leftTop"
                        >
                            <DeleteOutlined style={{ fontSize: 18, color: '#ff4d4f', cursor: 'pointer' }} />
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    return (
        <>
            <ProTable<IPermission>
                actionRef={tableRef}
                headerTitle="Danh sách Permissions"
                rowKey="id"
                columns={columns}
                loading={loading}
                request={async (params, sort, filter) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.name) query += `&name=/${params.name}/i`;
                    if (params.apiPath) query += `&apiPath=/${params.apiPath}/i`;
                    if (params.method) query += `&method=/${params.method}/i`;
                    if (params.module) query += `&module=/${params.module}/i`;

                    const sortField = Object.keys(sort)[0];
                    if (sortField) {
                        const sortOrder = sort[sortField] === 'ascend' ? 'asc' : 'desc';
                        query += `&sort=${sortField},${sortOrder}`;
                    } else {
                        query += `&sort=updatedAt,desc`;
                    }

                    try {
                        setLoading(true);
                        const res = await callFetchPermissions(query);
                        if (res?.statusCode === 200 && res.data) {
                            setCurrentDataTable(res.data.result);
                            setMeta(res.data.meta);
                            return {
                                data: res.data.result,
                                success: true,
                                total: res.data.meta.total,
                            };
                        }
                    } catch (error) {
                        notification.error({
                            message: 'Lỗi khi load dữ liệu permissions',
                            description: 'Không thể fetch dữ liệu permissions',
                        });
                    } finally {
                        setLoading(false);
                    }
                    return {
                        data: [],
                        success: false,
                        total: 0,
                    };
                }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => (
                        <div>{range[0]}-{range[1]} trên {total} permissions</div>
                    )
                }}
                toolBarRender={() => [
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
            <CreatePermission
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <DetailPermission
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <UpdatePermission
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default PermissionTable;
