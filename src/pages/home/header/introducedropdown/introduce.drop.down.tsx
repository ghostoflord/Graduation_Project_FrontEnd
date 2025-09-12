import { Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';

const gioiThieuSubItems = [
    { label: "Giới thiệu LaptopNew", path: "/gioi-thieu" },
    { label: "Tầm nhìn - Sứ mệnh", path: "/tam-nhin-su-menh" },
    { label: "Giá trị cốt lõi", path: "/gia-tri-cot-loi" }
];

const IntroduceDropDown = () => {
    const menu = (
        <Menu>
            {gioiThieuSubItems.map(item => (
                <Menu.Item key={item.path}>
                    <Link to={item.path}>{item.label}</Link>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['hover']}>
            <span className="dropdown-link">
                Giới thiệu
            </span>
        </Dropdown>
    );
};

export default IntroduceDropDown;
