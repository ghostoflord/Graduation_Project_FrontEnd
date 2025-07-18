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

    const handleSearch = (value: string) => {
        const trimmed = value.trim();
        if (trimmed) {
            navigate(`/?search=${encodeURIComponent(trimmed)}`);
        } else {
            navigate(`/`);
        }
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
    }, [user, isAuthenticated]);

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
                    <div className="header-top mobile-layout">
                        {/* Hàng TRÊN: Logo trái | Notification + Cart phải */}
                        <div className="top-row">
                            <div className="logo">
                                <Link to="/">
                                    <img src={logo} alt="LaptopNew" />
                                </Link>
                            </div>
                            <div className="right-icons">
                                <NotificationBell userId={user?.id} />
                                <Badge count={cartSummary?.sum || 0} size="small">
                                    <Button
                                        type="text"
                                        icon={<ShoppingCartOutlined />}
                                        className="cart-button"
                                        onClick={() => navigate('/gio-hang')}
                                    />
                                </Badge>
                            </div>
                        </div>

                        {/* Hàng DƯỚI: Burger trái | Avatar phải */}
                        <div className="bottom-row">
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setDrawerVisible(true)}
                            />
                            {isAuthenticated ? (
                                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                    <Avatar
                                        size="small"
                                        src={`${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user?.avatar}`}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Dropdown>
                            ) : (
                                <Link to="/login">
                                    <Button icon={<UserOutlined />} type="text" />
                                </Link>
                            )}
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
                            Hệ thống cửa hàng (10+ chi nhánh)
                        </Button>

                        <div className="search-bar">
                            <Input.Search
                                placeholder="Từ khóa..."
                                allowClear
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onSearch={handleSearch}
                            />
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
                                                src={`${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user?.avatar}`}
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
                        <li
                            className={`category-dropdown ${showCategory ? 'open' : ''}`}
                            onClick={() => setShowCategory(!showCategory)}
                        >
                            <span className="dropdown-link">Lọc sản phẩm</span>
                            <div className="dropdown-menu">
                                <ul>
                                    <li>
                                        <NavLink to="/?sort=price_asc">Giá tăng dần</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/?sort=price_desc">Giá giảm dần</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/?priceFrom=5000000&priceTo=15000000">
                                            Từ 5 triệu - 15 triệu
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/?priceFrom=15000000&priceTo=30000000">
                                            Từ 15 triệu - 30 triệu
                                        </NavLink>
                                    </li>
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

                <Drawer
                    title="Danh mục"
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                >
                    <ul className="mobile-menu">
                        <li><NavLink to="/?sort=price_asc">Giá tăng dần</NavLink></li>
                        <li><NavLink to="/?sort=price_desc">Giá giảm dần</NavLink></li>
                        <li><NavLink to="/?priceFrom=5000000&priceTo=15000000">Từ 5 triệu - 15 triệu</NavLink></li>
                        <li><NavLink to="/?priceFrom=15000000&priceTo=30000000">Từ 15 triệu - 30 triệu</NavLink></li>
                        <li><NavLink to="/">Trang chủ</NavLink></li>
                        <li><IntroduceDropDown /></li>
                        <li><NavLink to="/chinh-sach-ban-hang">Chính sách bán hàng</NavLink></li>
                        <li><NavLink to="/tin-tuc">Tin tức</NavLink></li>
                        <li><NavLink to="/tuyen-dung">Tuyển dụng</NavLink></li>
                        <li><NavLink to="/nhuong-quyen">Nhượng quyền</NavLink></li>
                        <li><NavLink to="/lien-he">Liên hệ</NavLink></li>
                        <li><NavLink to="/tra-cuu-bao-hanh">Tra cứu bảo hành</NavLink></li>
                    </ul>
                </Drawer>
            </div>
        </div>
    );
}
