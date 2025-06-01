import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { callFetchNotifications } from '@/services/api';
import CreateNotification from './notification.create';

const NotificationTable = () => {
    const tableRef = useRef<ActionType>();
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);

    //create user
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

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
            render: (_, record) => record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : '',
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
                request={async (params, sort, filter) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.title) query += `&title=/${params.title}/i`;

                    try {
                        setLoading(true);
                        const res = await callFetchNotifications(query);
                        if (res?.statusCode === 200) {
                            setMeta(res.data.meta);
                            return {
                                data: res.data.result,
                                success: true,
                                total: res.data.meta.total,
                            };
                        }
                    } catch (error) {
                        notification.error({
                            message: 'Lỗi khi load dữ liệu thông báo',
                            description: 'Không thể fetch dữ liệu thông báo',
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
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
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
        </>
    );
};

export default NotificationTable;
