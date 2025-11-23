import "./shipping.policy.scss";

const ShippingPolicy = () => {
    return (
        <div className="shipping-policy-container">
            <h2 className="title">PHƯƠNG THỨC VẬN CHUYỂN</h2>
            <div className="policy-details">
                <h3>I - ĐỐI VỚI KHÁCH HÀNG Ở TP.HCM:</h3>
                <ul>
                    <li>Khách hàng lựa chọn sản phẩm trên website, đặt hàng qua điện thoại, website hoặc email.</li>
                    <li>Laptopnew giao hàng tận nơi trong vòng 90 phút với sản phẩm có sẵn. <strong>Miễn phí 100% cước vận chuyển.</strong></li>
                    <li>Thanh toán bằng <strong>TIỀN MẶT / CHUYỂN KHOẢN</strong> sau khi kiểm tra sản phẩm và quà tặng, ưu đãi đi kèm (nếu có).</li>
                </ul>

                <h3>II - ĐỐI VỚI KHÁCH HÀNG Ở TỈNH/TP KHÁC:</h3>
                <ul>
                    <li>Khách đặt hàng qua điện thoại, website hoặc email sau khi chọn sản phẩm tại <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">LaptopShop.vn</a>.</li>
                    <li>Nhân viên xác thực thông tin đơn hàng, hướng dẫn đặt cọc <strong>tối thiểu 200.000 - 500.000 VND</strong> để tránh đơn hàng ảo theo hướng dẫn tại <a href="http://localhost:3000/phuong-thuc-thanh-toan" target="_blank" rel="noopener noreferrer">phương thức thanh toán</a>.</li>
                    <li>Sau khi xác nhận thanh toán, đơn hàng sẽ được đóng gói và giao qua <strong>Viettel Post / Vietnam Post</strong>. Nhân viên sẽ cung cấp mã vận đơn để khách hàng theo dõi.</li>
                    <li>Thời gian giao hàng:
                        <ul>
                            <li>+ 48 giờ với trung tâm TP/Tỉnh.</li>
                            <li>+ Cộng thêm 24 giờ nếu là huyện/xã.</li>
                        </ul>
                    </li>
                    <li>Khách kiểm tra sản phẩm trước khi thanh toán phần còn lại. Có quyền từ chối nếu sản phẩm bị khui, cấn, móp.</li>
                    <li>Nếu thanh toán phần còn lại qua nhân viên giao hàng, phụ thu <strong>1%</strong> (trừ khi đã chuyển khoản 100%).</li>
                    <li>Áp dụng với: Laptop, PC đồng bộ hoặc đơn hàng trên 10 triệu.</li>
                </ul>

                <h3>III - THÔNG TIN CẦN THIẾT:</h3>
                <ul>
                    <li>Xem thêm <a href="http://localhost:3000/doi-tra" target="_blank" rel="noopener noreferrer">chính sách đổi trả & bảo hành</a>.</li>
                    <li>Mọi thắc mắc liên hệ CSKH: <strong>1900 8946</strong> (08:00 - 21:00, Thứ 2 - Chủ nhật).</li>
                </ul>
            </div>
        </div>
    );
};

export default ShippingPolicy;
