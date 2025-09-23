

import { useEffect, useRef, useState } from 'react';
import { callDeleteRole, callFetchPermissions, callFetchRoles } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm } from 'antd';
import UpdateRole from './update.role';
import CreateRole from './create.role';
import DetailRole from './detail.role';

type TSearch = {
    name: string;
    description: string;
}

const TableRole = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IRole | null>(null);

    const [permissions, setPermissions] = useState<IPermission[]>([]);

    const [isDeleteRole, setIsDeleteRole] = useState<boolean>(false);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IRole | null>(null);

    const [currentDataTable, setCurrentDataTable] = useState<IRole[]>([]);

    const handleDeleteUser = async (id: string) => {
        setIsDeleteRole(true);
        try {
            const res = await callDeleteRole(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa user thành công');
                refreshTable();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa user'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa user'
            });
        } finally {
            setIsDeleteRole(false);
        }
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await callFetchPermissions();
            if (res && res.data) {
                setPermissions(res.data);
            }
        };
        fetchPermissions();
    }, []);

    const columns: ProColumns<IRole>[] = [
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
            title: 'Tên vai trò',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'date',
        },
        {
            title: 'Cập nhật gần nhất',
            dataIndex: 'updatedAt',
            valueType: 'date',
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
                            title={"Xác nhận xóa role"}
                            description={"Bạn có chắc chắn muốn xóa role này ?"}
                            onConfirm={() => handleDeleteUser(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteRole }}
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

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IRole, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;

                    const filters: string[] = [];

                    if (params.name) {
                        filters.push(`name~'${params.name}'`);
                    }

                    if (params.description) {
                        filters.push(`description~'${params.description}'`);
                    }

                    if (filters.length > 0) {
                        query += `&filter=${filters.join(" and ")}`;
                    }

                    const res = await callFetchRoles(query);

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


                rowKey="id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                    showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng ${total}`,
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
            <UpdateRole
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                allPermissions={permissions}
            />

            <CreateRole
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <DetailRole
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default TableRole;
