
import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from "react-csv";
import CreateUser from './create.user';
import DetailUser from './detail.user';
import UpdateUser from './update.user';
import ImportUser from './import.user';
type TSearch = {
    name: string;
    email: string;
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

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);

    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const handleDeleteUser = async (id: string) => {
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
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
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
            width: 100,
            ellipsis: true,
            dataIndex: 'address',
        },
        {
            title: ' Age',
            dataIndex: 'age',
            ellipsis: true,
        },
        {
            title: ' Gender',
            dataIndex: 'gender',
            ellipsis: true,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (_, entity) => {
                const avatar = entity.avatar;
                const avatarUrl = avatar ? `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${avatar}` : null;
                return avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="User Avatar"
                        style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                ) : (
                    <span>No avatar</span>
                );
            },
            ellipsis: true,
        },
        {
            title: 'Update At',
            dataIndex: 'updateAt',
            valueType: 'date',
            width: 100,
            sorter: true,
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
            width: 100,
            ellipsis: true,
            sorter: true,
            hideInSearch: true
        },

        {
            title: 'Action',
            hideInSearch: true,
            width: 100,
            render(dom, entity, index, action, schema) {
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                ></div>
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
                    </>
                )
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
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.name) {
                            query += `&name=/${params.name}/i`
                        }
                    }

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? [])
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

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
                toolBarRender={() => [
                    <CSVLink
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
                    ,

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>,

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