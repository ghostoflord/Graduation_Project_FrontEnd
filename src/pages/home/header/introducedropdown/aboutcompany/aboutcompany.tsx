import "./about.company.scss";

type AboutSection = {
    title: string;
    content: string[];
};

const aboutSections: AboutSection[] = [
    {
        title: "GIỚI THIỆU",
        content: [
            "Tên Công ty: CÔNG TY TNHH CÔNG NGHỆ VÀ TIN HỌC HỒNG PHÁT",
            "Tên giao dịch: LAPTOPSHOP.vn",
            "Văn phòng: 54/205/8 Phạm Hùng, xã Bình Hưng, Huyện Bình Chánh, Tp.HCM",
            "Giấy phép ĐKKD: 0318111456",
            "Hệ thống cửa hàng:",
            "- Chi nhánh 1: 29 Tân Thành, P12, Q5, Tp.HCM",
            "- Chi nhánh 2: 399 Xô Viết Nghệ Tĩnh, P14, Q.Bình Thạnh, Tp.HCM",
            "- Chi nhánh 3: Quận 10 sắp khai trương",
            "CallCenter: 1900.8946 - Email: khachhang@laptopshop.vn"
        ]
    },
    {
        title: "1. Quá trình hình thành và phát triển",
        content: [
            "✓ LAPTOPSHOP chính thức được thành lập vào năm 2010...",
            "✓ Trong quá trình phát triển, LAPTOPSHOP mở rộng hoạt động kinh doanh đa dạng...",
            "✓ Với nền tảng vững chắc, LAPTOPSHOP chính thức đặt nền móng trở thành công ty phân phối và bán lẻ Laptop hàng đầu Việt Nam..."
        ]
    },
    {
        title: "NHỮNG DẤU MỐC QUAN TRỌNG VÀ THÀNH TỰU",
        content: [
            "✓ Được chứng nhận đại lý uỷ quyền của Dell, HP, Asus, Acer, MSI, Lenovo, LG, Rapoo...",
            "✓ Năm 2015: Top 10 nhà cung cấp Laptop chính hãng uy tín tại Việt Nam.",
            "✓ T4/2017: Hợp tác cùng MSI mở Concept Store đầu tiên tại Việt Nam.",
            "✓ T7/2018: Nhà phân phối uỷ quyền chính thức của AverMedia.",
            "✓ T10/2023: Hợp nhất thành Công ty TNHH Công nghệ và Tin học Hồng Phát."
        ]
    },
    {
        title: "2. Mục tiêu với đối tác",
        content: [
            "✓ Đa dạng mẫu mã, chất lượng tốt, giá cạnh tranh.",
            "✓ Xây dựng mối quan hệ hợp tác win-win với các nhà sản xuất, đối tác.",
            "✓ Thành công của khách hàng là tương lai của công ty."
        ]
    },
    {
        title: "3. Tầm nhìn",
        content: [
            "• Trở thành hệ thống showroom Laptop chuyên nghiệp, thân thiện hàng đầu Việt Nam.",
            "• Xây dựng môi trường làm việc chuyên nghiệp, phát triển cá nhân tối đa.",
            "• LAPTOPSHOP là ngôi nhà chung, chia sẻ quyền lợi và trách nhiệm công bằng."
        ]
    },
    {
        title: "4. Giá trị cốt lõi",
        content: [
            "• Khách hàng là trọng tâm",
            "• Uy tín",
            "• Chất lượng",
            "• Trung thực",
            "• Hiệu quả",
            "• Phát triển con người",
            "• Tạo sự khác biệt"
        ]
    },
    {
        title: "5. Triết lý kinh doanh",
        content: [
            "• Chất lượng sản phẩm và dịch vụ: Yếu tố tạo nên sự phát triển bền vững.",
            "• Phương châm: Dám nghĩ, dám làm, dám chịu trách nhiệm.",
            "• Chăm sóc khách hàng: Xây dựng niềm tin bền vững.",
            "• Yếu tố rủi ro: Luôn nằm trong tầm kiểm soát.",
            "• Ý thức, tinh thần trách nhiệm: Phát huy sức mạnh tập thể."
        ]
    }
];

const AboutCompany = () => {
    return (
        <div className="about-company-container">
            <h2 className="title">GIỚI THIỆU CÔNG TY</h2>
            {aboutSections.map((section, index) => (
                <div key={index} className="about-section-item">
                    <h3>
                        {section.title}
                    </h3>
                    <ul>
                        {section.content.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default AboutCompany;
