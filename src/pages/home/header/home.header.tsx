// Header.tsx
import { Badge, Button, Input } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import './home.header.scss';
import { NavLink } from 'react-router-dom';
export default function Header() {
    return (
        <div className="header-wrapper">
            <div className="header-top">
                <div className="logo">
                    <img src="/logo.svg" alt="LaptopNew" />
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
                    <Button className="login-button" icon={<UserOutlined />}>Đăng nhập / Đăng ký</Button>
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
