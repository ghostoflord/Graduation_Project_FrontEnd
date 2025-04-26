import { PhoneOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import "./home.header.scss";
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import logo from '@/assets/logo.jpg';

const Header = () => {
    const [showSubMenu, setShowSubMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowSubMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    return (
        <div className="laptopnew-header">
            <div className="top-bar">
                <div className="logo">
                    <img src={logo} alt="LaptopNew Logo" />
                </div>

                <div className="search-box">
                    <input type="text" placeholder="Từ khoá..." />
                </div>

                {/* Tin khuyến mãi + Tin tức công nghệ */}
                <div className="news-links">
                    <NavLink to="/tin-khuyen-mai" className="news-link">Tin khuyến mãi</NavLink>
                    <span>|</span>
                    <NavLink to="/tin-tuc-cong-nghe" className="news-link">Tin tức công nghệ</NavLink>
                </div>

                <div className="contact">
                    <span>
                        <PhoneOutlined style={{ marginRight: 6 }} />
                        Gọi mua hàng
                    </span>
                    <strong>1900.8946</strong>
                </div>

                <div className="actions">
                    <NavLink to="/login" className="login-btn">
                        <UserOutlined style={{ marginRight: 6 }} />
                        Đăng nhập / Đăng ký
                    </NavLink>
                    <button className="cart-btn">
                        <ShoppingCartOutlined />
                        <span className="cart-text">Giỏ hàng</span>
                    </button>
                </div>
            </div>

            <div className="menu-bar">
                <ul>
                    <NavLink to="/">Trang chủ</NavLink>
                    <div
                        className="navbar-item-with-sub"
                        ref={menuRef}
                        onClick={toggleSubMenu}
                    >
                        <NavLink
                            to="/gioithieu"
                            className="navlink"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleSubMenu();
                            }}
                        >
                            Giới thiệu ▼
                        </NavLink>

                        {showSubMenu && (
                            <div className="submenu">
                                <NavLink to="/laptopnew" onClick={() => setShowSubMenu(false)}>
                                    Giới thiệu LaptopNew
                                </NavLink>
                                <NavLink to="/tam-nhin-su-menh" onClick={() => setShowSubMenu(false)}>
                                    Tầm nhìn & Sứ mệnh
                                </NavLink>
                                <NavLink to="/gia-tri-cot-loi" onClick={() => setShowSubMenu(false)}>
                                    Giá trị cốt lõi
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <NavLink to="/chinh-sach">Chính sách bán hàng</NavLink>
                    <NavLink to="/tin-tuc">Tin tức</NavLink>
                    <NavLink to="/tuyen-dung">Tuyển dụng</NavLink>
                    <NavLink to="/nhuong-quyen">Nhượng quyền</NavLink>
                    <NavLink to="/lien-he">Liên hệ</NavLink>
                    <NavLink to="/tra-cuu-bao-hanh">Tra cứu bảo hành</NavLink>
                </ul>
            </div>

            <div className="banner">
                <img src="/banner-msi.jpg" alt="MSI RTX 50 Banner" />
                <div className="banner-overlay">
                    <h2>CHÍNH THỨC MỞ BÁN</h2>
                    <p>Laptop MSI mới nhất với RTX™ 50 Series</p>
                </div>
            </div>
        </div>
    );
};

export default Header;
