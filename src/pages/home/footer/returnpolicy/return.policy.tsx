import CommonBreadcrumb from "@/pages/productbreadcrumb/aboutbreadcrumb/about.breadcrumb";
import "./return.policy.scss";

const ReturnPolicy = () => {
    return (
        <div className="return-policy-container">
            <CommonBreadcrumb current="đổi trả" />
            <h2 className="title">CHÍNH SÁCH ĐỔI TRẢ</h2>
            <div className="policy-details">
                <p><strong>Kính gửi: quý khách hàng thân thiết LAPTOPSHOP.</strong></p>
                <p>
                    Nhằm đảm bảo quyền lợi cho các khách hàng mua các sản phẩm tại hệ thống LAPTOPSHOP (hoặc mua hàng trực tuyến). LAPTOPSHOP xin thông báo về điều khoản đổi trả và bảo hành như sau:
                </p>

                <h3>1. CHÍNH SÁCH 1 ĐỔI 1</h3>
                <ul>
                    <li>LAPTOPSHOP sẽ thực hiện đổi sản phẩm tương tự khi:
                        <ul>
                            <li>Sản phẩm phát sinh lỗi linh kiện phần cứng do NSX trong vòng 30 ngày kể từ ngày mua đối với các dòng Laptop Notebook, PC Desktop, Linh phụ kiện, Gaming Gear.</li>
                        </ul>
                    </li>
                </ul>
                <p><strong>ĐIỀU KIỆN:</strong></p>
                <ul>
                    <li>Sản phẩm do LAPTOPSHOP cung cấp, đầy đủ thùng hộp, không bị trầy xước hay dán keo.</li>
                    <li>Sản phẩm được thẩm định lỗi phần cứng từ NSX.</li>
                    <li>Sản phẩm được đổi mới khi LAPTOPSHOP còn hàng (hoặc Đổi qua sản phẩm khác tương đương hoặc chênh lệch).</li>
                </ul>

                <h3>2. CHÍNH SÁCH BẢO HÀNH</h3>
                <ul>
                    <li>Sản phẩm được bảo hành trực tiếp tại TTBH của NSX trên toàn quốc (hoặc tại hệ thống cửa hàng LAPTOPSHOP).</li>
                    <li>LAPTOPSHOP không chịu trách nhiệm, đảm bảo về phần mềm và dữ liệu khách hàng khi nhận bảo hành sản phẩm.</li>
                </ul>

                <p><strong>CÁC TRƯỜNG HỢP BỊ TỪ CHỐI BẢO HÀNH:</strong></p>
                <ul>
                    <li>Sản phẩm không phải cung cấp bởi LAPTOPSHOP.</li>
                    <li>Sản phẩm đã hết thời hạn Bảo hành.</li>
                    <li>Không có tem LAPTOPSHOP hoặc tem NSX.</li>
                    <li>Sản phẩm hư hỏng do người dùng hoặc tác động bên ngoài.</li>
                    <li>Do thiên tai, nguồn điện sai, BIOS thay đổi, hoặc do nâng/hạ cấp không đúng.</li>
                    <li>Không bảo hành với quà tặng khuyến mãi.</li>
                    <li>Màn hình trên 5 điểm chấm sáng theo quy định NSX.</li>
                </ul>

                <h3>3. CHÍNH SÁCH ĐỔI / NÂNG ĐỜI SẢN PHẨM KHÁC</h3>
                <ul>
                    <li>Sản phẩm phải do LAPTOPSHOP cung cấp (hoặc có hóa đơn chính hãng).</li>
                    <li>Không bị rơi rớt, va đập, vô nước, đã từng bảo hành.</li>
                    <li>Nguyên tem NSX, chưa tháo hoặc nâng cấp máy.</li>
                </ul>
                <p><strong>Mức khấu hao:</strong></p>
                <ul>
                    <li>30% / 3 tháng đầu tiên.</li>
                    <li>Thêm 10% / 3 tháng tiếp theo.</li>
                </ul>
                <p><em>*Lưu ý:</em> Giá thu hồi dựa theo giá hiện tại, laptop cao cấp sẽ có chính sách riêng.</p>

                <p>
                    Riêng các dòng Intel Gen 10/11 hoặc Ryzen 5000 đã hết bảo hành vẫn có thể thẩm định nâng đời với mức hỗ trợ từ <strong>2.000.000 - 4.000.000 VND</strong> tùy tình trạng máy.
                </p>

                <p>
                    Để biết thêm chi tiết, vui lòng liên hệ Bộ phận tiếp nhận & thẩm định - <strong>SDT/Zalo: 0948377986</strong> (Thời gian: 09:00 - 20:00, T2 - T7).
                </p>
            </div>
        </div>
    );
};

export default ReturnPolicy;
