import { Badge, Button, Input, Avatar, Space, Dropdown } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './home.header.scss';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';
import type { MenuProps } from 'antd';
import { message } from "antd";
export default function Header() {
    const { user, isAuthenticated, setIsAuthenticated, setUser } = useCurrentApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        message.success("Đăng xuất thành công!");
        navigate('/login');
    };

    const itemsDropdown: MenuProps['items'] = [
        {
            label: <Link to="/profile">Trang cá nhân</Link>,
            key: 'profile',
        },
        {
            label: <span onClick={handleLogout} style={{ cursor: "pointer" }}>Đăng xuất</span>,
            key: 'logout',
        }
    ];

    return (
        <div className="header-wrapper">
            <div className="header-top">
                <div className="logo">
                    <Link to="/">
                        <img src="/logo.svg" alt="LaptopNew" />
                    </Link>
                </div>
                <Button className="store-button">Hệ thống cửa hàng (10+ chi nhánh)</Button>
                <div className="search-bar">
                    <Input.Search placeholder="Từ khóa..." allowClear />
                </div>
                <div className="news-links">
                    <a href="#">Tin khuyến mãi</a>
                    <span>|</span>
                    <a href="#">Tin tức công nghệ</a>
                </div>
                <div className="call-phone">
                    <div>Gọi mua hàng</div>
                    <div className="phone-number">1900.8946</div>
                </div>
                <div className="actions">
                    {!isAuthenticated ? (
                        <Link to="/login">
                            <Button className="login-button" icon={<UserOutlined />}>
                                Đăng nhập / Đăng ký
                            </Button>
                        </Link>
                    ) : (
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user?.avatar}`} />
                                <span>{user?.name}</span>
                            </Space>

                        </Dropdown>
                    )}
                    <Badge count={4} size="small" offset={[-5, 5]}>
                        <Button shape="circle" icon={<ShoppingCartOutlined />} className="cart-button" />
                    </Badge>
                </div>
            </div>

            <div className="header-menu">
                <ul>
                    <li><NavLink to="/danh-muc-san-pham">Danh mục sản phẩm</NavLink></li>
                    <li><NavLink to="/">Trang chủ</NavLink></li>
                    <li><NavLink to="/gioi-thieu">Giới thiệu</NavLink></li>
                    <li><NavLink to="/chinh-sach-ban-hang">Chính sách bán hàng</NavLink></li>
                    <li><NavLink to="/tin-tuc">Tin tức</NavLink></li>
                    <li><NavLink to="/tuyen-dung">Tuyển dụng</NavLink></li>
                    <li><NavLink to="/nhuong-quyen">Nhượng quyền</NavLink></li>
                    <li><NavLink to="/lien-he">Liên hệ</NavLink></li>
                    <li><NavLink to="/tra-cuu-bao-hanh">Tra cứu bảo hành</NavLink></li>
                </ul>
            </div>
        </div>
    );
}
