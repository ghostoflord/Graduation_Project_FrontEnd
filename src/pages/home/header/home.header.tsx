import { Badge, Button, Input, Avatar, Space, Dropdown, message } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './home.header.scss';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';
import type { MenuProps } from 'antd';
import { useEffect } from 'react';
import { getCart } from '@/services/api';
import IntroduceDropDown from './introducedropdown/introduce.drop.down';

export default function Header() {
    const { user, isAuthenticated, setIsAuthenticated, setUser, cartSummary = { sum: 0 }, setCartSummary } = useCurrentApp();
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
                    <div style={{ position: 'relative' }}>
                        <Button
                            shape="circle"
                            icon={<ShoppingCartOutlined />}
                            className="cart-button"
                            onClick={() => navigate('/cart')}
                        />
                        {cartSummary && Number(cartSummary.sum) > 0 && (
                            // <span
                            //     style={{
                            //         position: 'absolute',
                            //         top: -5,
                            //         right: -5,
                            //         backgroundColor: '#ff4d4f',
                            //         color: 'white',
                            //         borderRadius: '50%',
                            //         padding: '0 6px',
                            //         fontSize: '12px',
                            //         fontWeight: 'bold',
                            //         lineHeight: '20px',
                            //         minWidth: 20,
                            //         textAlign: 'center',
                            //         zIndex: 1
                            //     }}
                            // >
                            <span className="cart-badge">{cartSummary.sum}</span>
                            // </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="header-menu">
                <ul>
                    <li><NavLink to="/danh-muc-san-pham">Danh mục sản phẩm</NavLink></li>
                    <li><NavLink to="/">Trang chủ</NavLink></li>
                    <li>
                        <IntroduceDropDown /> {/* dùng component tách riêng */}
                    </li>
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
