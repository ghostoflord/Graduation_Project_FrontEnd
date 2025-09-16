import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, ExceptionOutlined, HeartTwoTone, TeamOutlined, UserOutlined, DollarCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ProductOutlined, ApiOutlined, NotificationOutlined, DollarOutlined, MoneyCollectOutlined, SlidersOutlined } from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import { Outlet, useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { useCurrentApp } from '../context/app.context';
import { logoutAPI } from '@/services/api';
import { message } from 'antd';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const { user, setUser, setIsAuthenticated, isAuthenticated, setCarts } = useCurrentApp();
    const navigate = useNavigate();
    const location = useLocation();

    const items: MenuItem[] = [
        {
            label: <Link to='/admin/dashboard'>Dashboard</Link>,
            key: '/admin/dashboard',
            icon: <AppstoreOutlined />,
        },
        {
            label: <span>Manage Users</span>,
            key: '/admin/user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to='/admin/user'>CRUD</Link>,
                    key: '/admin/user',
                    icon: <TeamOutlined />,
                },
            ]
        },
        {
            label: <Link to='/admin/product'>Manage Products</Link>,
            key: '/admin/product',
            icon: <ExceptionOutlined />,

        },
        {
            label: <Link to='/admin/product/detail'>Product Detail</Link>,
            key: '/admin/product/detail',
            icon: <ProductOutlined />,
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: '/admin/order',
            icon: <DollarCircleOutlined />
        },
        {
            label: <Link to='/admin/permission'>Manage Permission</Link>,
            key: '/admin/permission',
            icon: <ApiOutlined />
        },
        {
            label: <Link to='/admin/role'>Manage Role</Link>,
            key: '/admin/role',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/notification'>Manage Notification</Link>,
            key: '/admin/notification',
            icon: <NotificationOutlined />
        },
        {
            label: <Link to='/admin/voucher'>Manage Voucher</Link>,
            key: '/admin/voucher',
            icon: <DollarOutlined />
        },
        {
            label: <Link to='/admin/flashsale'>Manage Flash Sale</Link>,
            key: '/admin/flashsale',
            icon: <MoneyCollectOutlined />
        },

        {
            label: <Link to='/admin/slide'>Manage Slide</Link>,
            key: '/admin/slide',
            icon: <SlidersOutlined />
        },
    ];

    useEffect(() => {
        const activeItem = items.find(item => location.pathname === (item?.key as any));
        if (activeItem && activeItem.key) {
            setActiveMenu(activeItem.key as string);
        } else {
            setActiveMenu('/admin');
        }
    }, [location]);

    const handleLogout = async () => {
        try {
            await logoutAPI();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem("carts");
            message.success('Đăng xuất thành công!', 2);
            navigate('/login', { replace: true });
        }
    };

    const itemsDropdown = [
        {
            label: <Link to={'/profile'}>Thông tin tài khoản</Link>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user?.avatar}`;

    if (isAuthenticated === false) {
        return <Navigate to="/login" replace />;
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === "USER") {
            return <Navigate to="/" replace />;
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }} className="layout-admin">
            <Sider
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                breakpoint="lg"
                collapsedWidth={80}
                onBreakpoint={(broken) => setCollapsed(broken)}
            >
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    Admin
                </div>
                <Menu
                    defaultSelectedKeys={[activeMenu]}
                    selectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>
            <Layout>
                <div
                    className='admin-header'
                    style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",
                    }}
                >
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                            style: {
                                cursor: 'pointer',
                                display: window.innerWidth <= 1000 ? 'none' : 'block', // Hide on mobile
                            }
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <Space style={{ cursor: "pointer" }}>
                            <Avatar src={urlAvatar} />
                            {user?.name}
                        </Space>
                    </Dropdown>
                </div>
                <Content style={{ padding: '15px' }}>
                    <Outlet />
                </Content>
                <Footer style={{ padding: 0, textAlign: "center" }}>
                    LaptopShop &copy;Ghost - Made with <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
