import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { callDeletePermission, callFetchPermissions } from "@/services/api";
import { colorMethod } from "@/utils/config";

const PermissionTable = () => {
    const tableRef = useRef<ActionType>();
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [currentDataTable, setCurrentDataTable] = useState<IPermission[]>([]);

    const handleDeletePermission = async (id: string | undefined) => {
        if (id) {
            const res = await callDeletePermission(id);
            if (res && res.statusCode === 200) {
                message.success('Xóa Permission thành công');
                tableRef?.current?.reload();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error,
                });
            }
        }
    };

    const columns: ProColumns<IPermission>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            width: 80,
            render: (_, record) => <a>{record.id}</a>,
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
            render: (_, record) => (
                <Space>
                    <EditOutlined
                        style={{ fontSize: 18, color: '#ffa500' }}
                        onClick={() => console.log("Edit permission", record)}
                    />
                    <Popconfirm
                        title="Xác nhận xóa permission?"
                        description="Bạn có chắc chắn muốn xóa permission này?"
                        onConfirm={() => handleDeletePermission(record.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        placement="leftTop"
                    >
                        <DeleteOutlined style={{ fontSize: 18, color: '#ff4d4f', cursor: 'pointer' }} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
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
                    if (res?.statusCode === 200) {
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
                    key="add"
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => console.log("Open create permission modal")}
                >
                    Thêm mới
                </Button>
            ]}
        />
    );
};

export default PermissionTable;
