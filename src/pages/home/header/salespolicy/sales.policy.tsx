import React from "react";
import "./sales.policy.scss"; // nhớ import SCSS

type Section = {
    title: string;
    content: string[];
};

const sections: Section[] = [
    {
        title: "CAM KẾT SẢN PHẨM",
        content: [
            "Hàng chính hãng, Mới 100%, Đầy đủ phụ kiện.",
            "Thời gian bảo hành theo tiêu chuẩn quy định của từng Nhà sản xuất. Vui lòng xem thời gian bảo hành trong mục chi tiết từng sản phẩm.",
            "Sản phẩm được bảo hành tại các trung tâm bảo hành của Nhà sản xuất trên toàn quốc (hoặc nhà phân phối tại Việt Nam) và hệ thống LAPTOPNEW."
        ]
    },
    {
        title: "CHÍNH SÁCH HỖ TRỢ BÁN HÀNG VÀ SAU BÁN HÀNG",
        content: [
            "1 Đổi 1 trong 30 ngày đầu nếu sản phẩm LAPTOP NOTEBOOK, PC DESKTOP, LINH KIỆN, GAMING GEAR bị lỗi phần cứng do nhà sản xuất. (Vui lòng giữ lại các phụ kiện đi kèm, thùng hộp và không bị trầy xước).",
            "Miễn phí cài đặt các phần mềm, ứng dụng trong 2 năm.",
            "Miễn phí vệ sinh máy, vệ sinh tản nhiệt trong 2 năm.",
            "Hỗ trợ trả bảo hành tận nơi tại Tp.HCM. Áp dụng thành viên VIP.",
            "Đội ngũ kỹ thuật hỗ trợ khắc phục & hướng dẫn online trong quá trình sử dụng.",
            "Trợ giá cho các lần mua tiếp theo.",
            "Miễn phí cài đặt, lắp đặt khi nâng cấp RAM, SSD."
        ]
    }
];

const SalesPolicy = () => {
    return (
        <div className="sales-policy-container">
            <h2 className="title">CHÍNH SÁCH BÁN HÀNG</h2>
            <p className="thank-you">
                Chân thành cảm ơn quý khách đã cho LAPTOPNEW.vn cơ hội được phục vụ.
                Nhằm mang lại sự yên tâm và hài lòng của quý khách, LAPTOPNEW thông tin về chính sách bán hàng.
            </p>
            {sections.map((section, index) => (
                <div key={index} className="sales-policy-item">
                    <h3>
                        {index + 1} - {section.title}
                    </h3>
                    <ul>
                        {section.content.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
            <p className="contact-info">
                Để tư vấn và giải đáp, quý khách liên hệ CallCenter: <strong>1900.8946</strong>.
                Thời gian phục vụ: Thứ 2 - Chủ nhật (09:00 - 21:00).
            </p>
        </div>
    );
};

export default SalesPolicy;
