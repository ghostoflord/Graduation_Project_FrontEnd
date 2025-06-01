import { List, Popover, Typography, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getNotificationsAPI, markNotificationAsReadAPI } from '@/services/api';
import './notification.scss';

const NotificationBell = ({ userId }: { userId: number }) => {
    const [notifications, setNotifications] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchNotifications();
        }
    }, [visible]);

    const fetchNotifications = async () => {
        const res = await getNotificationsAPI(userId);
        if (res?.data) setNotifications(res.data);
    };

    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    const handleMarkAsRead = async (id: number) => {
        await markNotificationAsReadAPI(id);
        fetchNotifications();
    };

    return (
        <Popover
            title={
                <div className="notification-header">
                    THÔNG BÁO
                </div>
            }
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
            content={
                <List
                    dataSource={notifications}
                    renderItem={(item: any) => (
                        <List.Item
                            onClick={() => handleMarkAsRead(item.id)}
                            className={`notification-item ${!item.isRead ? 'unread' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <div>
                                <div className="notification-title">{item.title}</div>
                                <div className="notification-content">{item.content}</div>
                            </div>
                        </List.Item>
                    )}
                />

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
