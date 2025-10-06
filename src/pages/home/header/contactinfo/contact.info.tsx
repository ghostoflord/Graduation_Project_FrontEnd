import "./contact.info.scss";

const ContactInfo = () => {
    return (
        <div className="contact-info-container">
            <h2 className="title">LIÊN HỆ</h2>
            <div className="contact-details">
                <p><strong>CÔNG TY TNHH CÔNG NGHỆ VÀ TIN HỌC NGUYỄN QUANG HIỆP</strong></p>
                <p>GPĐK & MST: 0123456789 - Nơi cấp: Sở KH-ĐT Tp.HN</p>
                <p>Văn phòng: Cầu Giấy,Thành Phố Hà Nội</p>

                <ul>
                    <li>Chi nhánh 1: Cầu Giấy,Thành Phố Hà Nội</li>
                    <li>Chi nhánh 2: Khuất Duy Tiến,Quận Thanh Xuân,Thành Phố Hà Nội</li>
                    <li>Chi nhánh 3: Quốc Oai sắp khai trương</li>
                </ul>

                <ul>
                    <li>CallCenter: <strong>0123456789</strong></li>
                    <li>Tư vấn & Bán hàng Showroom - Line: 1</li>
                    <li>Phòng kinh doanh và doanh nghiệp - Line: 2</li>
                    <li>Hỗ trợ kỹ thuật - Line: 3</li>
                    <li>Phản ánh dịch vụ - Line: 0 hoặc Email: <a href="mailto:cskh@laptopshop.vn">cskh@laptopshop.vn</a></li>
                    <li>Phụ trách sản phẩm - Hotline: <strong>0123456789</strong></li>
                </ul>

                <p><strong>THỜI GIAN HOẠT ĐỘNG:</strong> Thứ 2 - Thứ 7: 08:00 - 21:00 (Riêng Chủ Nhật, Lễ: 08:30 - 17:30)</p>
                <p>(Giữ xe miễn phí trong giờ làm việc)</p>
            </div>
        </div>
    );
};

export default ContactInfo;
