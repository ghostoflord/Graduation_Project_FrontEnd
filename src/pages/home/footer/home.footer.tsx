import { FacebookOutlined, YoutubeOutlined, TikTokOutlined, InstagramOutlined, ShoppingCartOutlined, } from '@ant-design/icons';
import "./home.footer.scss";
import logo from '@/assets/logo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="container">
            <footer className="laptopnew-footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="footer-column about">
                            <img src={logo} alt="LaptopNew" />
                            <div className="contact-info">
                                <p><strong>Trụ sở chính:</strong></p>
                                <p>- Showroom 1: 29 Tân Thành, P12, Q5, Tp.HCM</p>
                                <p>- Showroom 2: 399 Xô Viết Nghệ Tĩnh, P14, Q.Bình Thạnh, Tp.HCM</p>
                                <p>- Showroom 3: Q11 sắp khai trương</p>
                                <p><strong>Email:</strong> khachhang@laptopnew.vn</p>
                                <p><strong>Hotline:</strong> 1900.8946</p>
                            </div>
                        </div>
                        <div className="footer-column">
                            <h4>Chính sách</h4>
                            <ul>
                                <li><Link to="/chinh-sach-ban-hang">Chính sách bán hàng</Link></li>
                                <li><Link to="/doi-tra">Phương thức đổi trả</Link></li>
                                <li><Link to="/van-chuyen">Phương thức vận chuyển</Link></li>
                                <li><Link to="/phuong-thuc-thanh-toan">Phương thức thanh toán</Link></li>
                                <li><Link to="/bao-mat">Chính sách bảo mật</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Kết nối với chúng tôi</h4>
                            <div className="social-icons">
                                <FacebookOutlined className="social-icon fb" />
                                <InstagramOutlined className="social-icon ig" />
                                <YoutubeOutlined className="social-icon yt" />
                                <TikTokOutlined className="social-icon tiktok" />
                                <ShoppingCartOutlined className="social-icon lazada" />
                            </div>
                            <p>Phương thức thanh toán</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>Bản quyền thuộc về LAPTOPNEW.vn © {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
