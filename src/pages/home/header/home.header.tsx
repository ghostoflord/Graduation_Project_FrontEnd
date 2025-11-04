import {
    Badge,
    Button,
    Input,
    Avatar,
    Space,
    Dropdown,
    message,
    Drawer,
} from 'antd';
import {
    BellOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    MenuOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import './home.header.scss';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getCart } from '@/services/api';
import IntroduceDropDown from './introducedropdown/introduce.drop.down';
import logo from '@/assets/logo.png';
import NotificationBell from '@/components/notification/notification.bell';
import ProductSearchBar from './product.search.bar.props';

export default function Header() {
    const {
        user,
        isAuthenticated,
        setIsAuthenticated,
        setUser,
        cartSummary = { sum: 0 },
        setCartSummary,
    } = useCurrentApp();

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [searchValue, setSearchValue] = useState(query.get('search') || '');
    const [showCategory, setShowCategory] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkTablet = () => {
            setIsTablet(window.innerWidth >= 500 && window.innerWidth <= 1100);
        };

        checkTablet();
        window.addEventListener("resize", checkTablet);

        return () => window.removeEventListener("resize", checkTablet);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 500);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        message.success('Đăng xuất thành công!');
        navigate('/login');
    };

    const itemsDropdown: MenuProps['items'] = useMemo(() => {
        if (!isAuthenticated || !user) return [];

        const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
        const isShipper = user?.role === 'SHIPPER';

        const items: MenuProps['items'] = [];

        if (isAdmin) {
            items.push({
                label: <Link to="/admin/dashboard">Quản trị hệ thống</Link>,
                key: 'admin',
            });
        }

        if (isShipper) {
            items.push({
                label: <Link to="/shipper">Nhận Đơn Hàng</Link>,
                key: 'shipper',
            });
        }

        if (isTablet) {
            items.push({
                label: <Link to="/product-list">Danh mục sản phẩm</Link>,
                key: "product-list",
            });
        }

        items.push(
            {
                label: <Link to="/profile">Trang cá nhân</Link>,
                key: 'profile',
            },
            {
                label: (
                    <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        Đăng xuất
                    </span>
                ),
                key: 'logout',
            }
        );

        return items;
    }, [user, isAuthenticated], isTablet);

    useEffect(() => {
        if (!user?.id || cartSummary?.sum) return;
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
    }, [user?.id]);

    return (
        <div className="container">
            <div className="header-wrapper">
                {isMobile ? (
                    <div className="header-mobile">
                        {/* Hàng trên: menu, logo, bell, cart */}
                        <div className="top-row">
                            <div className="left">
                                <Button
                                    icon={<MenuOutlined />}
                                    className="menu-btn"
                                    onClick={() => setDrawerVisible(true)}
                                />
                            </div>

                            <div className="center">
                                <Link to="/">
                                    <img
                                        src={logo}
                                        alt="LaptopNew"
                                        className="logo"
                                        style={{ height: 36 }}
                                    />
                                </Link>
                            </div>

                            <div className="right">
                                {isAuthenticated && <NotificationBell userId={user?.id} />}

                                <Badge count={cartSummary?.sum || 0} size="small" offset={[-4, 4]}>
                                    <Button
                                        shape="circle"
                                        icon={<ShoppingCartOutlined />}
                                        className="cart-button"
                                        onClick={() => navigate('/gio-hang')}
                                    />
                                </Badge>
                            </div>
                        </div>

                        {/* Hàng dưới: search + avatar */}
                        <div className="bottom-row">
                            <div className="search-bar">
                                <ProductSearchBar placeholder="Tìm kiếm sản phẩm..." />
                            </div>

                            <div className="avatar">
                                {isAuthenticated ? (
                                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                        <Space style={{ cursor: 'pointer' }}>
                                            <Avatar
                                                size={36}
                                                src={
                                                    user?.avatar?.startsWith("http")
                                                        ? `${user.avatar}?t=${Date.now()}`
                                                        : `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user?.avatar}`
                                                }
                                            />
                                        </Space>
                                    </Dropdown>
                                ) : (
                                    <Link to="/login">
                                        <Avatar size={36} icon={<UserOutlined />} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="header-top">
                        <div className="logo">
                            <Link to="/">
                                <img src={logo} alt="LaptopNew" />
                            </Link>
                        </div>

                        <Button className="store-button">
                            Hệ thống cửa hàng (4+ chi nhánh)
                        </Button>

                        <div className="search-bar">
                            <ProductSearchBar initialValue={searchValue} />
                        </div>

                        <div className="news-links">
                            <a href="#">Tin khuyến mãi</a>
                            <span>|</span>
                            <a href="#">Tin tức công nghệ</a>
                        </div>

                        <div className="call-phone">
                            <div>Gọi mua hàng</div>
                            <div className="phone-number">0123456789</div>
                        </div>

                        <div className="actions">
                            {!isAuthenticated ? (
                                <Link to="/login">
                                    <Button
                                        className="login-button"
                                        icon={<UserOutlined />}
                                    >
                                        Đăng nhập / Đăng ký
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <NotificationBell userId={user?.id} />
                                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                        <Space style={{ cursor: 'pointer' }}>
                                            <Avatar
                                                size={36}
                                                src={
                                                    user?.avatar?.startsWith("http")
                                                        ? user.avatar
                                                        : `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user?.avatar}`
                                                }
                                            />
                                            <span>{user?.name}</span>
                                        </Space>
                                    </Dropdown>
                                </>
                            )}
                            <Badge count={cartSummary?.sum || 0} size="small" offset={[-4, 4]}>
                                <Button
                                    shape="circle"
                                    icon={<ShoppingCartOutlined />}
                                    className="cart-button"
                                    onClick={() => navigate('/gio-hang')}
                                />
                            </Badge>
                        </div>
                    </div>
                )}

                <div className="header-menu">
                    <ul>
                        <li><NavLink to="/product-list">Danh mục sản phẩm</NavLink></li>
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
                <Drawer
                    title="Danh mục"
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                >
                    <ul className="mobile-menu">
                        <li><NavLink to="/profile" onClick={() => setDrawerVisible(false)}>Trang cá nhân</NavLink></li>
                        <li><NavLink to="/product-list" onClick={() => setDrawerVisible(false)}>Danh mục sản phẩm</NavLink></li>
                        <li><NavLink to="/" onClick={() => setDrawerVisible(false)}>Trang chủ</NavLink></li>
                        <li><IntroduceDropDown onItemClick={() => setDrawerVisible(false)} /></li>
                        <li><NavLink to="/chinh-sach-ban-hang" onClick={() => setDrawerVisible(false)}>Chính sách bán hàng</NavLink></li>
                        <li><NavLink to="/tin-tuc" onClick={() => setDrawerVisible(false)}>Tin tức</NavLink></li>
                        <li><NavLink to="/tuyen-dung" onClick={() => setDrawerVisible(false)}>Tuyển dụng</NavLink></li>
                        <li><NavLink to="/nhuong-quyen" onClick={() => setDrawerVisible(false)}>Nhượng quyền</NavLink></li>
                        <li><NavLink to="/lien-he" onClick={() => setDrawerVisible(false)}>Liên hệ</NavLink></li>
                        <li><NavLink to="/tra-cuu-bao-hanh" onClick={() => setDrawerVisible(false)}>Tra cứu bảo hành</NavLink></li>
                    </ul>
                </Drawer>
            </div>
        </div>
    );
}
