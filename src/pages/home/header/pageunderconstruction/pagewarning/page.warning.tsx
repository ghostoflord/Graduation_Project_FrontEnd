import { NavLink } from "react-router-dom";
import { Button, Result } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons"; // Icon tam giác cảnh báo

const PageWarning = () => (
    <Result
        icon={<ExclamationCircleOutlined style={{ fontSize: 64, color: "#faad14" }} />}
        title="Cảnh báo"
        subTitle={
            <div>
                <p>Sản phẩm quý khách chọn đang không có thông tin chi tiết nên không thể so sánh được.</p>
                <p>Xin lỗi vì sự bất tiện này, chúng tôi sẽ khắc phục sớm nhất có thể.</p>
            </div>
        }
        extra={
            <NavLink to="/">
                <Button type="primary">Về trang chủ</Button>
            </NavLink>
        }
    />
);

export default PageWarning;
