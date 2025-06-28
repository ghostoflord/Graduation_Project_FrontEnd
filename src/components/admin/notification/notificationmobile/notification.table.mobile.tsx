import { useEffect, useRef, useState } from 'react';
import {
    Card,
    Col,
    Pagination,
    Row,
    Spin,
    Typography,
    App,
    Button
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { callFetchNotifications } from '@/services/api';
import CreateNotification from '../notification.create';
import { ActionType } from '@ant-design/pro-components';

interface INotification {
    id: number;
    title: string;
    content: string;
    forAll: boolean;
    isRead: boolean;
    createdAt: string;
}

const NotificationTableMobile = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();

    const tableRef = useRef<ActionType>();
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const refreshTable = () => {
        tableRef.current?.reload();
    }
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await callFetchNotifications(`current=1&pageSize=100`);
            if (res?.data?.result) {
                setNotifications(res.data.result);
            }
        } catch (error) {
            message.error('Không thể tải danh sách thông báo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const paginatedData = notifications.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <>
            <div style={{ padding: 12 }}>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setOpenModalCreate(true)}
                    block
                    style={{ marginBottom: 12 }}
                >
                    Add New Notification
                </Button>

                {loading ? (
                    <Spin tip="Đang tải..." />
                ) : (
                    <>
                        <Row gutter={[12, 12]}>
                            {paginatedData.map((noti) => (
                                <Col xs={24} key={noti.id}>
                                    <Card title={noti.title} size="small">
                                        <Typography.Paragraph>
                                            {noti.content}
                                        </Typography.Paragraph>
                                        <div><strong>Dành cho tất cả:</strong> {noti.forAll ? '✔️' : '❌'}</div>
                                        <div><strong>Đã đọc:</strong> {noti.isRead ? '✔️' : '❌'}</div>
                                        <div><strong>Tạo lúc:</strong> {dayjs(noti.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={notifications.length}
                                onChange={(page) => setCurrentPage(page)}
                                size="small"
                                simple={window.innerWidth < 1000}
                            />
                        </div>
                    </>
                )}
            </div>

            <CreateNotification
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default NotificationTableMobile;
