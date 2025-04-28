import { NavLink } from "react-router-dom";
import { Button, Result } from 'antd';

const PageUnderConstruction = () => (
    <Result
        status="info"
        title="Đang cập nhật"
        subTitle="Trang đang trong quá trình cập nhật, vui lòng chờ."
        extra={
            <NavLink to="/">
                <Button type="primary">Về trang chủ</Button>
            </NavLink>
        }
    />
);

export default PageUnderConstruction;
