import { Alert, Button, Form, Input, Modal, message } from "antd";
import { postManualChatAPI } from "@/services/api";

interface AskStaffFormProps {
    open: boolean;
    onClose: () => void;
}

const AskStaffForm = ({ open, onClose }: AskStaffFormProps) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        try {
            await postManualChatAPI(values);
            message.success("Gửi câu hỏi thành công! Nhân viên sẽ liên hệ lại sớm.");
            form.resetFields();
            onClose();
        } catch (err) {
            message.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    return (
        <Modal
            open={open}
            title="📞 Gửi yêu cầu tới nhân viên hỗ trợ"
            onCancel={onClose}
            footer={null}
        >
            <Alert
                message="Hiện tại nhân viên đang không trực máy."
                description="Vui lòng điền vào biểu mẫu bên dưới, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                    <Input placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input placeholder="email@example.com" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                    <Input placeholder="0123456789" />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                    <Input placeholder="Số 1 Nguyễn Trãi, Hà Nội" />
                </Form.Item>

                <Form.Item
                    label="Câu hỏi / Vấn đề cần hỗ trợ"
                    name="question"
                    rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
                >
                    <Input.TextArea rows={4} placeholder="Tôi muốn hỏi về đơn hàng..." />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Gửi yêu cầu
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AskStaffForm;
