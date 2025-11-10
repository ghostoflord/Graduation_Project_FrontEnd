
import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Result, Tag } from 'antd';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CSVLink } from "react-csv";
import CreateUser from './create.user';
import DetailUser from './detail.user';
import UpdateUser from './update.user';
import ImportUser from './import.user';
import { useAuthorization } from '@/hooks/useAuthorization';
type TSearch = {
    name: string;
    email: string;
    address: string;
    gender: string;
    createdAt: string;
}
const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const { message, notification } = App.useApp();
    const { hasPermission } = useAuthorization();

    const canViewUsers = hasPermission('GET', '/api/v1/users');
    const canCreateUser = hasPermission('POST', '/api/v1/users');
    const canImportUser = hasPermission('POST', '/api/v1/users/import');
    const canUpdateUser = hasPermission('POST', '/api/v1/users/update') || hasPermission('PUT', '/api/v1/users/update');
    const canDeleteUser =
        hasPermission('DELETE', '/api/v1/users/:id') ||
        hasPermission('DELETE', '/api/v1/users/{id}') ||
        hasPermission('DELETE', '/api/v1/users');
    const canExportUser = canViewUsers;

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);

    const [openModalImport, setOpenModalImport] = useState<boolean>(false);

    if (!canViewUsers) {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Bạn không có quyền xem danh sách người dùng."
            />
        );
    }
    const handleDeleteUser = async (id: string) => {
        const canDeleteTarget =
            canDeleteUser ||
            hasPermission('DELETE', `/api/v1/users/${id}`);

        if (!canDeleteTarget) {
            message.error('Bạn không có quyền xóa người dùng.');
            return;
        }

        setIsDeleteUser(true);
        try {
            const res = await deleteUserAPI(id);
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
            setIsDeleteUser(false);
        }
    };
    const columns: ProColumns<IUserTable>[] = [
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
            title: ' Name',
            dataIndex: 'name',
            width: 100,
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 100,
            ellipsis: true,
            copyable: true
        },
        {
            title: ' Address',
            dataIndex: 'address',
            ellipsis: true,
        },
        {
            title: ' Age',
            dataIndex: 'age',
        },
        {
            title: ' Gender',
            dataIndex: 'gender',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (_, entity) => {
                const avatar = entity.avatar;
                let avatarUrl: string | null = null;

                if (avatar) {
                    avatarUrl = avatar.startsWith("http")
                        ? `${avatar}?t=${Date.now()}`
                        : `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${avatar}`;
                }

                return avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="User Avatar"
                        style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
                    />
                ) : (
                    <span>No avatar</span>
                );
            },
        },
        {
            title: 'Update At',
            dataIndex: 'updatedAt',
            valueType: 'date',
            hideInSearch: true
        },
        {
            title: 'Activate',
            dataIndex: 'activate',
            render: (value) => (
                <Tag color={value ? 'green' : 'red'}>
                    {value ? '1' : '0'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },

        {
            title: 'Action',
            hideInSearch: true,
            width: 100,
            render(dom, entity, index, action, schema) {
                const actionNodes: ReactNode[] = [];

                if (canUpdateUser) {
                    actionNodes.push(
                        <EditTwoTone
                            key={`edit-${entity.id}`}
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                    );
                }

                if (canDeleteUser) {
                    actionNodes.push(
                        <Popconfirm
                            key={`delete-${entity.id}`}
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => handleDeleteUser(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                    );
                }

                if (actionNodes.length === 0) {
                    return null;
                }

                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        {actionNodes}
                    </div>
                );
            }
        }

    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
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

                    const res = await getUsersAPI(query);

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
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }

                headerTitle="Table user"
                toolBarRender={() => {
                    const actions: ReactNode[] = [];

                    if (canExportUser) {
                        actions.push(
                            <CSVLink
                                key="export"
                                data={currentDataTable}
                                filename='export-user.csv'
                            >
                                <Button
                                    icon={<ExportOutlined />}
                                    type="primary"
                                >
                                    Export
                                </Button>
                            </CSVLink>
                        );
                    }

                    if (canImportUser) {
                        actions.push(
                            <Button
                                key="import"
                                icon={<CloudUploadOutlined />}
                                type="primary"
                                onClick={() => setOpenModalImport(true)}
                            >
                                Import
                            </Button>
                        );
                    }

                    if (canCreateUser) {
                        actions.push(
                            <Button
                                key="create"
                                icon={<PlusOutlined />}
                                onClick={() => setOpenModalCreate(true)}
                                type="primary"
                            >
                                Add new
                            </Button>
                        );
                    }

                    return actions;
                }}
            />

            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
            />
        </>
    );
};
export default TableUser;