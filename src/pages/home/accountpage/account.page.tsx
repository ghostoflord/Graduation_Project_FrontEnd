import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Space, Button, message, Modal } from "antd";
import { UserOutlined, LogoutOutlined, LockOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./account.page.scss";
import { getAccountInfoAPI, logoutAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import ModalChangePassword from "../../../components/client/account/modal.change.password";
import UserProfileForm from "./user.profile.form";
import LikedProducts from "./liked.products";


const { Title, Text } = Typography;

interface UserAccountInfo {
    name: string;
    email: string;
    orderCount: number;
    cartSum: number;
}

const AccountPage = () => {
    const [userData, setUserData] = useState<UserAccountInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { setUser, setIsAuthenticated, setCarts, setCartSummary } = useCurrentApp();
    const [changePassword, setChangePassword] = useState(false);

    const [openProfileModal, setOpenProfileModal] = useState(false);

    const [openLikedModal, setOpenLikedModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const res = await getAccountInfoAPI();
                setUserData(res.data);
            } catch (error) {
                console.error("Lỗi khi gọi API tài khoản:", error);
                message.error("Đã xảy ra lỗi khi tải thông tin tài khoản.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccountInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutAPI();
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            localStorage.removeItem("carts");

            setUser(null);
            setIsAuthenticated(false);
            setCarts([]);
            setCartSummary({ sum: 0 });

            message.success("Đăng xuất thành công!");

            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (err) {
            console.error("Logout failed:", err);
            message.error("Đã xảy ra lỗi khi đăng xuất.");
        }
    };

    if (loading) {
        return <div style={{ padding: "2rem" }}>Đang tải thông tin tài khoản...</div>;
    }

    if (!userData) {
        return <div style={{ padding: "2rem" }}>Không có thông tin người dùng.</div>;
    }

    return (
        <>
            <div className="account-page">
                <Row gutter={[16, 16]}>
                    {/* Cột trái */}
                    <Col xs={24} md={12}>
                        <Row gutter={[16, 16]}>
                            {/* Lịch sử đơn hàng */}
                            <Col xs={24} md={12}>
                                <Card className="account-card order-history">
                                    <Title level={5}>Lịch sử đơn hàng</Title>
                                    <Text>{userData.orderCount} đơn hàng</Text>
                                </Card>
                            </Col>

                            {/* Xin chào */}
                            <Col xs={24} md={12}>
                                <Card className="account-card greeting-card small-greeting">
                                    <UserOutlined className="greeting-icon" />
                                    <Title level={5}>Xin chào, {userData.name}!</Title>
                                </Card>
                            </Col>

                            {/* Thông tin cá nhân (full width dưới 2 cái trên) */}
                            <Col xs={24}>
                                <Card title="Thông tin cá nhân" className="account-card">
                                    <p>
                                        <strong>Họ và tên:</strong> {userData.name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {userData.email}
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    {/* Cột phải */}
                    <Col xs={24} md={12}>
                        <Card title="Thông tin tài khoản" className="account-card">
                            <Space direction="vertical" style={{ width: "100%" }}>
                                <Button
                                    icon={<UserOutlined />}
                                    block
                                    onClick={() => setOpenProfileModal(true)}
                                >
                                    Cập nhật thông tin cá nhân
                                </Button>
                                <Button
                                    icon={<LockOutlined />}
                                    block
                                    onClick={() => setChangePassword(true)}
                                >
                                    Đổi mật khẩu
                                </Button>
                                <Button
                                    icon={<EnvironmentOutlined />}
                                    block
                                    onClick={() => navigate("/lich-su-mua-hang")}
                                >
                                    Lịch sử giao hàng
                                </Button>
                                <Button
                                    icon={<UserOutlined />}
                                    block
                                    onClick={() => setOpenLikedModal(true)}
                                >
                                    Sản phẩm đã thích
                                </Button>
                                <Button icon={<LogoutOutlined />} block danger onClick={handleLogout}>
                                    Đăng xuất
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>


            </div>

            <ModalChangePassword
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
                onSuccess={() => {
                    localStorage.clear();
                    setUser(null);
                    setIsAuthenticated(false);
                    setCarts([]);
                    setCartSummary({ sum: 0 });
                    message.success("Vui lòng đăng nhập lại.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 800);
                }}
            />
            <Modal
                title="Cập nhật thông tin cá nhân"
                open={openProfileModal}
                onCancel={() => setOpenProfileModal(false)}
                footer={null}
                destroyOnClose
            >
                <UserProfileForm
                    userId={userId}
                    onUpdateSuccess={() => setOpenProfileModal(false)}
                />
            </Modal>
            <Modal
                title="Sản phẩm đã thích"
                open={openLikedModal}
                onCancel={() => setOpenLikedModal(false)}
                footer={null}
                destroyOnClose
            >
                <LikedProducts userId={userId} />
            </Modal>
        </>
    );
};

export default AccountPage;
