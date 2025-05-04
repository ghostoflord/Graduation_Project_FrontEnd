import React from "react";
import "./payment.policy.scss";

const PaymentPolicy = () => {
    return (
        <div className="payment-policy-container">
            <h2 className="title">PHƯƠNG THỨC THANH TOÁN</h2>
            <div className="policy-details">
                <p>
                    Kính chào quý khách hàng của <strong>LAPTOPNEW</strong>!
                </p>
                <p>
                    Chân thành cảm ơn quý khách đã cho LAPTOPNEW cơ hội được phục vụ. Quý khách chỉ thanh toán khi thật sự hài lòng với sản phẩm và chất lượng dịch vụ của chúng tôi.
                    Chúng tôi luôn nỗ lực mang đến nhiều phương thức thanh toán sản phẩm tiện lợi và dễ dàng nhất để Quý khách lựa chọn.
                </p>

                <h3>1. THANH TOÁN TIỀN MẶT:</h3>
                <ul>
                    <li>Quý khách hàng có thể đến trực tiếp công ty để mua hàng và thanh toán.</li>
                    <li>Hoặc thanh toán tiền mặt khi nhận hàng tận nơi đối với khách ở TP.HCM.</li>
                    <li>
                        Đối với khách hàng ở tỉnh/thành khác, <strong>phí thu hộ</strong> sẽ tùy thuộc vào đơn vị vận chuyển fax nhanh.
                    </li>
                </ul>

                <h3>2. THANH TOÁN CHUYỂN KHOẢN:</h3>
                <ul>
                    <li>
                        Quý khách có thể chuyển khoản qua các tài khoản ngân hàng <strong>chính thức</strong> của LAPTOPNEW.
                        Khi chuyển khoản vui lòng ghi rõ nội dung: <br />
                        <strong>CÚ PHÁP: [HỌ TÊN KHÁCH HÀNG] + [SỐ ĐIỆN THOẠI] + [TÊN SẢN PHẨM]</strong>
                    </li>
                </ul>

                <h4>DANH SÁCH TÀI KHOẢN CÔNG TY:</h4>
                <ul>
                    <li><strong>NGÂN HÀNG TMCP Á CHÂU (ACB)</strong></li>
                    <li>TÊN TÀI KHOẢN: CÔNG TY TNHH CÔNG NGHỆ VÀ TIN HỌC HỒNG PHÁT</li>
                    <li>SỐ TÀI KHOẢN: 2288811888</li>
                </ul>

                <h4>DANH SÁCH TÀI KHOẢN CÁ NHÂN:</h4>
                <ul>
                    <li><strong>NGÂN HÀNG TMCP Á CHÂU (ACB)</strong></li>
                    <li>TÊN TÀI KHOẢN: HUỲNH XUÂN ÂN</li>
                    <li>SỐ TÀI KHOẢN: 7986.7888</li>
                </ul>

                <h3>LƯU Ý:</h3>
                <ul>
                    <li>
                        Khách hàng thực hiện chuyển khoản sẽ được <strong>miễn phí 100% phí giao dịch</strong> (người nhận chịu phí).
                    </li>
                    <li>
                        LAPTOPNEW chỉ chịu trách nhiệm với giao dịch <strong>qua các tài khoản chính thức</strong> của công ty khi có phát sinh.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default PaymentPolicy;
