import React from "react";

type CoreValue = {
    title: string;
    content: string[];
};

const coreValues: CoreValue[] = [
    {
        title: "TRUNG THỰC",
        content: [
            "Cam kết đối xử công bằng, không gian dối và luôn nói sự thật với khách hàng và đối tác.",
            "Không tham lam, không gian dối kết quả người khác làm kết quả của mình.",
            "Trung thực trong việc sử dụng tài sản, tài chính của Công ty và trong chuyên môn nghiệp vụ.",
            "Ngay thẳng, thật thà, nói sự thật không sai lệch với cấp trên và bản thân.",
            "Không báo cáo sai sự thật, đặc biệt trung thực trong tài chính.",
        ],
    },
    {
        title: "CHÍNH TRỰC",
        content: [
            "Tuân thủ nguyên tắc đạo đức và pháp luật: Đảm bảo rằng mọi hoạt động của Laptopnew đều được thực hiện đúng đắn, không vi phạm quy định và luôn tuân thủ các tiêu chuẩn cao nhất.",
            "Nói gì làm đấy.",
            "Khi bạn đã thật sự nỗ lực hết sức để giữ lời mà vẫn không thể giữ lời, ngay lập tức bạn thông tin cho những người liên quan chịu trách nhiệm về việc không giữ lời, dọn dẹp hậu quả gây ra và đưa ra cam kết mới.",
        ],
    },
    {
        title: "TẬN TÂM",
        content: [
            "Luôn đặt khách hàng lên hàng đầu: “Hôm nay có gì để làm tốt hơn cho khách hàng”.",
            "Tư vấn và phục vụ khách hàng như phục vụ chính người thân trong gia đình mình.",
            "Chủ động lắng nghe để hiểu nhu cầu và mối quan tâm của khách hàng. Tư vấn những sản phẩm và dịch vụ phù hợp nhất với nhu cầu sử dụng và khả năng tài chính của khách hàng.",
            "Laptopnew luôn thượng tôn pháp luật, duy trì đạo đức nghề nghiệp và đạo đức xã hội ở tiêu chuẩn cao nhất.",
            "Laptopnew chăm sóc khách hàng bằng sự tự nguyện hiểu rõ sứ mệnh phục vụ khách hàng và phụng sự xã hội.",
        ],
    },
    {
        title: "DẤN THÂN",
        content: [
            "Làm việc máu lửa, không ngại khó khăn và luôn sẵn sàng đấu tranh để đạt được mục tiêu.",
            "Bước qua giới hạn của bản thân dám thử sức ở mọi nhiệm vụ và mục tiêu được giao.",
            "Tìm ra được chính mình trong công việc đem về những kinh nghiệm từ đó kiến tạo, đổi mới cách phục vụ làm thỏa mãn khách hàng tốt hơn mỗi ngày.",
            "Không ngừng thử thách và thay đổi hàng ngày để hoàn thiện tư duy và kỹ năng trong hoạt động phục vụ khách hàng.",
        ],
    },
    {
        title: "ĐOÀN KẾT",
        content: [
            "Tất cả thành viên luôn gắn kết thành một thể thống nhất, đồng lòng vì mục đích chung.",
            "Tạo môi trường làm việc thân thiện và khuyến khích sự chia sẻ thông tin, ý tưởng và sự hỗ trợ giữa các thành viên trong công ty.",
            "Luôn lấy yêu thương để đối xử với đồng đội, hỗ trợ đồng đội hoàn thành tốt công việc.",
        ],
    },
    {
        title: "TRÁCH NHIỆM",
        content: [
            "Sẵn sàng nhận lỗi, khuyết điểm khi bản thân mắc lỗi hoặc có khuyết điểm cần khắc phục.",
            "Cam kết tuân thủ quy định, đảm bảo an toàn và chất lượng cho khách hàng, đối tác và cộng đồng.",
            "Luôn nhìn ra trách nhiệm của mình trong mọi việc không hiệu quả xảy ra. Không đổ lỗi hoặc chỉ tay về người khác.",
            "Sau khi đã nhận ra 100% nguồn gốc của vấn đề là ở chỗ mình, bạn có quyền buộc người khác cộng tác với mình để tạo ra thay đổi.",
        ],
    },
];

const CoreValues = () => {
    return (
        <div className="px-4 md:px-16 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">GIÁ TRỊ CỐT LÕI</h2>
            {coreValues.map((value, index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                        {index + 1} - {value.title}
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {value.content.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CoreValues;
