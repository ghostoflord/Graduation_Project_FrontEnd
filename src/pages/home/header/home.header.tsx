
import React from "react";
import "./home.header.scss";

const Header = () => {
    return (
        <div className="laptopnew-header">
            <div className="top-bar">
                <div className="logo">
                    <img src="/logo.png" alt="LaptopNew Logo" />
                </div>

                <div className="search-box">
                    <input type="text" placeholder="Từ khoá..." />
                </div>

                <div className="contact">
                    <span>Gọi mua hàng</span>
                    <strong>1900.8946</strong>
                </div>

                <div className="actions">
                    <button>Đăng nhập / Đăng ký</button>
                    <button className="cart-btn">
                        <span>Giỏ hàng</span>
                    </button>
                </div>
            </div>

            <div className="menu-bar">
                <ul>
                    <li>Danh mục sản phẩm</li>
                    <li>Trang chủ</li>
                    <li>Giới thiệu</li>
                    <li>Chính sách bán hàng</li>
                    <li>Tin tức</li>
                    <li>Tuyển dụng</li>
                    <li>Nhượng quyền</li>
                    <li>Liên hệ</li>
                    <li>Tra cứu bảo hành</li>
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
