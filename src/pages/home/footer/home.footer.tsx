
import "./home.footer.scss";

const Footer = () => {
    return (
        <footer className="laptopnew-footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h4>Về Laptopnew</h4>
                    <ul>
                        <li>Giới thiệu công ty</li>
                        <li>Hệ thống cửa hàng</li>
                        <li>Tuyển dụng</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Chính sách</h4>
                    <ul>
                        <li>Chính sách bảo hành</li>
                        <li>Chính sách đổi trả</li>
                        <li>Chính sách vận chuyển</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Hỗ trợ khách hàng</h4>
                    <ul>
                        <li>Hướng dẫn mua hàng</li>
                        <li>Hướng dẫn thanh toán</li>
                        <li>Gửi yêu cầu hỗ trợ</li>
                        <li>Kiểm tra đơn hàng</li>
                    </ul>
                </div>

                <div className="footer-column contact">
                    <h4>Liên hệ</h4>
                    <p><strong>Hotline:</strong> 1900.8946</p>
                    <p><strong>Email:</strong> support@laptopnew.vn</p>
                    <div className="socials">
                        <img src="/icon-facebook.png" alt="Facebook" />
                        <img src="/icon-youtube.png" alt="YouTube" />
                        <img src="/icon-zalo.png" alt="Zalo" />
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} LaptopNew.vn - All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
