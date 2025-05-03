import { Badge, Button, Input, Avatar, Space, Dropdown, message } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './home.header.scss';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';
import type { MenuProps } from 'antd';
import { useEffect, useMemo } from 'react';
import { getCart } from '@/services/api';
import IntroduceDropDown from './introducedropdown/introduce.drop.down';
import logo from '@/assets/logo.png';
import { useState } from 'react';
export default function Header() {
    const { user, isAuthenticated, setIsAuthenticated, setUser, cartSummary = { sum: 0 }, setCartSummary } = useCurrentApp();
    const navigate = useNavigate();
    const [showCategory, setShowCategory] = useState(false);
    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        message.success("Đăng xuất thành công!");
        navigate('/login');
    };

    const itemsDropdown: MenuProps['items'] = useMemo(() => {
        if (!isAuthenticated || !user) return [];

        const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

        const items: MenuProps['items'] = [];

        if (isAdmin) {
            items.push({
                label: <Link to="/admin/dashboard">Quản trị hệ thống</Link>,
                key: 'admin',
            });
        }

        items.push(
            {
                label: <Link to="/profile">Trang cá nhân</Link>,
                key: 'profile',
            },
            {
                label: <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</span>,
                key: 'logout',
            }
        );

        return items;
    }, [user, isAuthenticated]);

    useEffect(() => {
        if (!user?.id) return;

        (async () => {
            try {
                const res = await getCart(user.id);
                if (res?.data) {
                    setCartSummary(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        })();
    }, [user?.id, setCartSummary]);

    return (
        <div className="header-wrapper">
            <div className="header-top">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="LaptopNew" />
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
                    <div style={{ position: 'relative' }}>
                        <Button
                            shape="circle"
                            icon={<ShoppingCartOutlined />}
                            className="cart-button"
                            onClick={() => navigate('/gio-hang')}
                        />
                        {cartSummary && Number(cartSummary.sum) > 0 && (
                            <span className="cart-badge">{cartSummary.sum}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="header-menu">
                <ul>
                    <li
                        className={`category-dropdown ${showCategory ? 'open' : ''}`}
                        onClick={() => setShowCategory(!showCategory)}
                    >
                        <span className="dropdown-link">Danh mục sản phẩm</span>
                        <div className="dropdown-menu">
                            <ul>
                                <li><NavLink to="/laptop-van-phong"><i className="fa fa-laptop"></i> Laptop văn phòng</NavLink></li>
                                <li><NavLink to="/laptop-gaming"><i className="fa fa-gamepad"></i> Laptop gaming</NavLink></li>
                                <li><NavLink to="/laptop-content-creator"><i className="fa fa-video-camera"></i> Laptop content creator</NavLink></li>
                                <li><NavLink to="/pc-desktop"><i className="fa fa-desktop"></i> PC Desktop chính hãng</NavLink></li>
                                <li><NavLink to="/man-hinh"><i className="fa fa-tv"></i> LCD - Màn hình</NavLink></li>
                                <li><NavLink to="/gear-gaming"><i className="fa fa-keyboard-o"></i> Gear gaming</NavLink></li>
                                <li><NavLink to="/linh-kien"><i className="fa fa-cogs"></i> Linh kiện & thiết bị khác</NavLink></li>
                            </ul>
                        </div>
                    </li>
                    <li><NavLink to="/">Trang chủ</NavLink></li>
                    <li><IntroduceDropDown /></li>
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
