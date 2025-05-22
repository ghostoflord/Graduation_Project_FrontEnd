import "./contact.info.scss";

const ContactInfo = () => {
    return (
        <div className="contact-info-container">
            <h2 className="title">LIÊN HỆ</h2>
            <div className="contact-details">
                <p><strong>CÔNG TY TNHH CÔNG NGHỆ VÀ TIN HỌC HỒNG PHÁT</strong></p>
                <p>GPĐK & MST: 0318111456 - Nơi cấp: Sở KH-ĐT Tp.HCM</p>
                <p>Văn phòng: 54/205/8 Phạm Hùng, xã Bình Hưng, Huyện Bình Chánh, Tp.HCM</p>

                <ul>
                    <li>Chi nhánh 1: 29 Tân Thành, P12, Q5, Tp.HCM</li>
                    <li>Chi nhánh 2: 399 Xô Viết Nghệ Tĩnh, P24, Q.Bình Thạnh, Tp.HCM</li>
                    <li>Chi nhánh 3: Quận 10 sắp khai trương</li>
                    <li>Chi nhánh 4: Thành phố Thủ Đức</li>
                </ul>

                <ul>
                    <li>CallCenter: <strong>1900.8946</strong></li>
                    <li>Tư vấn & Bán hàng Showroom - Line: 1</li>
                    <li>Phòng kinh doanh và doanh nghiệp - Line: 2</li>
                    <li>Hỗ trợ kỹ thuật - Line: 3</li>
                    <li>Phản ánh dịch vụ - Line: 0 hoặc Email: <a href="mailto:cskh@laptopnew.vn">cskh@laptopnew.vn</a></li>
                    <li>Phụ trách sản phẩm - Hotline: <strong>0948377986</strong></li>
                </ul>

                <p><strong>THỜI GIAN HOẠT ĐỘNG:</strong> Thứ 2 - Thứ 7: 08:00 - 21:00 (Riêng Chủ Nhật, Lễ: 08:30 - 17:30)</p>
                <p>(Giữ xe miễn phí trong giờ làm việc)</p>
            </div>
        </div>
    );
};

export default ContactInfo;
