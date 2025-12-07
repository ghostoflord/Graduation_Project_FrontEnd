import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { App, Button, notification, Popconfirm } from 'antd';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { callFetchNotifications, deleteNotifications } from '@/services/api';
import CreateNotification from './notification.create';
import UpdateNotification from './notification.update';

const NotificationTable = () => {
    const tableRef = useRef<ActionType>();
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);

    const { message } = App.useApp();

    // modal create
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    // modal update
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<INotification | null>(null);

    // delete state
    const [isDeleteNotification, setIsDeleteNotification] = useState<boolean>(false);

    const handleDeleteNotification = async (id: number | string) => {
        setIsDeleteNotification(true);
        try {
            const res = await deleteNotifications(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa thông báo thành công');
                refreshTable();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa thông báo'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa thông báo'
            });
        } finally {
            setIsDeleteNotification(false);
        }
    };

    const columns: ProColumns<INotification>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: 'Dành cho tất cả',
            dataIndex: 'forAll',
            hideInSearch: true,
            render: (_, record) => record.forAll ? '✔️' : '❌'
        },
        {
            title: 'Đã đọc',
            dataIndex: 'isRead',
            hideInSearch: true,
            render: (_, record) => record.isRead ? '✔️' : '❌'
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : '',
        },
        {
            title: 'Action',
            hideInSearch: true,
            width: 120,
            render(_, entity) {
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
                            title={"Xác nhận xóa thông báo"}
                            description={"Bạn có chắc chắn muốn xóa thông báo này ?"}
                            onConfirm={() => handleDeleteNotification(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteNotification }}
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    const refreshTable = () => {
        tableRef.current?.reload();
    }

    return (
        <>
            <ProTable<INotification>
                actionRef={tableRef}
                headerTitle="Danh sách thông báo"
                rowKey="id"
                columns={columns}
                loading={loading}
                request={async (params) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;

                    const filters: string[] = [];

                    if (params.title) {
                        filters.push(`title~'${params.title}'`);
                    }

                    if (filters.length > 0) {
                        query += `&filter=${filters.join(" and ")}`;
                    }

                    try {
                        setLoading(true);
                        const res = await callFetchNotifications(query);
                        if (res?.statusCode === 200 && res.data) {
                            setMeta(res.data.meta);
                            return {
                                data: res.data.result,
                                success: true,
                                total: res.data.meta.total,
                            };
                        }
                    } catch (error) {
                        notification.error({
                            message: "Lỗi khi load dữ liệu thông báo",
                            description: "Không thể fetch dữ liệu thông báo",
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
                        <div>{range[0]}-{range[1]} trên {total} thông báo</div>
                    )
                }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenModalCreate(true)}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />

            <CreateNotification
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateNotification
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default NotificationTable;
