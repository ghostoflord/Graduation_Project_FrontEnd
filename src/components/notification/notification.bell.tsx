import { List, Popover, Button, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { getNotificationsAPI, markNotificationAsReadAPI } from '@/services/api';
import './notification.scss';

const PAGE_SIZE = Number(import.meta.env.VITE_NOTIFICATION_PAGE_SIZE) || 5;

const NotificationBell = ({ userId }: { userId: number }) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (visible && !initialized) {
            resetAndFetch();
            setInitialized(true);
        }
    }, [visible]);

    const resetAndFetch = async () => {
        setCurrent(1);
        setNotifications([]);
        setHasMore(true);
        await fetchNotifications(1);
    };

    const fetchNotifications = async (pageNum: number) => {
        if (loading || !hasMore) return; // 🚫 chặn tuyệt đối
        setLoading(true);
        try {
            const res = await getNotificationsAPI({
                userId,
                current: pageNum,
                pageSize: PAGE_SIZE,
            });

            const fetched = res?.data?.result ?? [];
            const meta = res?.data?.meta;

            setNotifications((prev) =>
                pageNum === 1 ? fetched : [...prev, ...fetched]
            );

            if (!meta || fetched.length === 0 || meta.page >= meta.pages) {
                // 🚫 Dứt điểm: không còn dữ liệu nữa
                setHasMore(false);
            } else {
                setCurrent(meta.page + 1);
                setHasMore(true);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        await markNotificationAsReadAPI(id);
        resetAndFetch();
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // 🧠 chỉ trigger khi chạm sát đáy và còn data
        if (!loading && hasMore && scrollTop + clientHeight >= scrollHeight - 5) {
            fetchNotifications(current);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <Popover
            title={<div className="notification-header">THÔNG BÁO</div>}
            trigger="click"
            open={visible}
            onOpenChange={(open) => {
                setVisible(open);
                if (open && !initialized) resetAndFetch();
            }}
            content={
                <div
                    className="notification-content-wrapper"
                    onScroll={handleScroll}
                    ref={listRef}
                >
                    <List
                        dataSource={notifications}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleMarkAsRead(item.id)}
                                className={`notification-item ${!item.isRead ? 'unread' : ''
                                    }`}
                            >
                                <div>
                                    <div className="notification-title">{item.title}</div>
                                    <div className="notification-content">{item.content}</div>
                                </div>
                            </List.Item>
                        )}
                    />
                    {loading && (
                        <Spin style={{ display: 'block', textAlign: 'center' }} />
                    )}
                    {!hasMore && !loading && (
                        <div style={{ textAlign: 'center', padding: 8, color: '#999' }}>
                            Không còn thông báo nào
                        </div>
                    )}
                </div>
            }
        >
            <Button className="notification-button">
                <BellOutlined className="icon" />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </Button>
        </Popover>
    );
};

export default NotificationBell;
