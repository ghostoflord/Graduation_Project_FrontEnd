import { useState } from 'react';
import { Button, Layout, Menu, Result } from 'antd';
import {
    InboxOutlined,
    CarOutlined,
    FileTextOutlined,
    BarChartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';
import ShipperOrderPage from './shipper.order';
import ShipperOrderList from './shipper.orde.list';
import ShipperDeliveredOrders from './shipper.delivered.orders';

const { Sider, Content } = Layout;

const menuItems = [
    { key: 'pending', icon: <InboxOutlined />, label: 'Đơn hàng chờ nhận' },
    { key: 'delivered', icon: <CarOutlined />, label: 'Đơn đang giao' },
    { key: 'history', icon: <FileTextOutlined />, label: 'Lịch sử đơn hàng' },
    { key: 'stats', icon: <BarChartOutlined />, label: 'Thống kê' },
    { key: '/', icon: <UserOutlined />, label: 'Trang chủ' },
];

const ShipperDashboard = () => {
    const [selectedKey, setSelectedKey] = useState('pending');
    const navigate = useNavigate();
    const { user } = useCurrentApp();

    const isShipper = user?.role === 'SHIPPER';

    if (!isShipper) {
        return (
            <Result
                status="403"
                title="403 - Forbidden"
                subTitle="Bạn không có quyền truy cập vào trang này"
                extra={<Button type="primary" onClick={() => navigate('/')}>Về trang chủ</Button>}
            />
        );
    }

    const renderContent = () => {
        switch (selectedKey) {
            case 'pending':
                return <ShipperOrderList selectedKey={selectedKey} />;
            case 'delivered':
                return <ShipperOrderPage selectedTab={selectedKey} />;
            case 'history':
                return <ShipperDeliveredOrders selectedTab={selectedKey} />;
            case 'stats':
                return <div>Thống kê đơn hàng (đang phát triển)</div>;
            case '/':
                navigate('/');
                return null;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={240} theme="light">
                <div
                    style={{
                        height: 64,
                        margin: 16,
                        fontWeight: 'bold',
                        fontSize: 20,
                        textAlign: 'center',
                    }}
                >
                    Shipper Panel
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={(e) => setSelectedKey(e.key)}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Content style={{ padding: 24 }}>{renderContent()}</Content>
            </Layout>
        </Layout>
    );
};

export default ShipperDashboard;
