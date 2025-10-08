import CommonBreadcrumb from "@/pages/productbreadcrumb/aboutbreadcrumb/about.breadcrumb";
import "./vision.mission.scss";

type Section = {
    title: string;
    content: string[];
};

const sections: Section[] = [
    {
        title: "TẦM NHÌN",
        content: [
            "Tầm nhìn của LAPTOPSHOP năm 2030 là trở thành công ty có hệ thống showroom Laptop quy mô, chuyên nghiệp và thân thiện lớn tại Việt Nam, đồng thời mang lại sự tận hưởng và giá trị cao nhất cho khách hàng.",
            "LAPTOPSHOP cam kết cung cấp bộ sưu tập đa dạng, phong phú và được chọn lọc kỹ lưỡng của các sản phẩm laptop hàng đầu từ các thương hiệu uy tín trên thị trường. Không ngừng nỗ lực cập nhật những xu hướng công nghệ mới nhất để đáp ứng nhu cầu đa dạng của khách hàng, từ sinh viên, doanh nhân đến người dùng cá nhân."
        ]
    },
    {
        title: "SỨ MỆNH",
        content: [
            "Sứ mệnh của LAPTOPSHOP là tạo ra một trải nghiệm mua sắm độc đáo và tối ưu cho khách hàng, không chỉ đáp ứng nhu cầu về sản phẩm chất lượng cao, mà còn đặc biệt quan tâm đến trải nghiệm dịch vụ khách hàng hoàn hảo. Từ việc tư vấn chuyên nghiệp, hỗ trợ kỹ thuật đến dịch vụ sau bán hàng, cam kết đồng hành và hỗ trợ khách hàng trọn vẹn trong suốt quá trình sử dụng sản phẩm.",
            "LAPTOPSHOP luôn coi trọng mối quan hệ với khách hàng và xây dựng niềm tin lâu dài. Không ngừng cải tiến và nâng cao chất lượng dịch vụ của mình, để khách hàng luôn cảm thấy hài lòng và tin tưởng vào sự lựa chọn của mình khi mua laptop tại LAPTOPSHOP.",
            "Đặc biệt chú trọng đến việc xây dựng một môi trường làm việc chuyên nghiệp và đội ngũ nhân viên tận tâm, có kiến thức sâu về sản phẩm và đam mê phục vụ khách hàng. Tạo điều kiện để nhân viên của phát triển và nâng cao kỹ năng, từ đó đảm bảo mang đến sự phục vụ tốt nhất cho khách hàng."
        ]
    }
];

const VisionMission = () => {
    return (
        <div className="vision-mission-container">
            <CommonBreadcrumb current="TẦM NHÌN - SỨ MỆNH" />
            <h2 className="title">TẦM NHÌN - SỨ MỆNH</h2>
            {sections.map((section, index) => (
                <div key={index} className="vision-mission-item">
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
        </div>
    );
};

export default VisionMission;
