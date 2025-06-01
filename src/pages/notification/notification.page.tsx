import NotificationBell from "@/components/notification/notification.bell";

const NotificationPage = () => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}');

    if (!userId) {
        return <div>Vui lòng đăng nhập để xem thông báo.</div>;
    }

    return (
        <div>
            <NotificationBell userId={userId} />
        </div>
    );
}
export default NotificationPage;