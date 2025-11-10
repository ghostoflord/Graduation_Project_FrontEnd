import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppstoreOutlined, ExceptionOutlined, HeartTwoTone, UserOutlined, DollarCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ProductOutlined, ApiOutlined, NotificationOutlined, DollarOutlined, MoneyCollectOutlined, SlidersOutlined } from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar, Result, Button } from 'antd';
import { Outlet, useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { useCurrentApp } from '../context/app.context';
import { logoutAPI } from '@/services/api';
import { message } from 'antd';
import type { MenuProps } from 'antd';
import { useAuthorization } from '@/hooks/useAuthorization';

type MenuItem = Required<MenuProps>['items'][number];
const { Content, Footer, Sider } = Layout;

type PermissionCheck = {
    method: string;
    apiPath: string;
};

type MenuAccessRule = {
    module?: string;
    anyPermissions?: PermissionCheck[];
};

type AdminMenuItemConfig = {
    key: string;
    title: string;
    icon: React.ReactNode;
    access?: MenuAccessRule;
};

const ADMIN_MENU_CONFIG: AdminMenuItemConfig[] = [
    {
        key: '/admin/dashboard',
        title: 'Dashboard',
        icon: <AppstoreOutlined />,
        access: {
            module: 'dashboard',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/dashboard' }],
        },
    },
    {
        key: '/admin/user',
        title: 'Manage Users',
        icon: <UserOutlined />,
        access: {
            module: 'user',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/users' }],
        },
    },
    {
        key: '/admin/product',
        title: 'Manage Products',
        icon: <ExceptionOutlined />,
        access: {
            module: 'product',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/products' }],
        },
    },
    {
        key: '/admin/product/detail',
        title: 'Product Detail',
        icon: <ProductOutlined />,
        access: {
            module: 'product-detail',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/product-details' }],
        },
    },
    {
        key: '/admin/order',
        title: 'Manage Orders',
        icon: <DollarCircleOutlined />,
        access: {
            module: 'order',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/orders/all' }],
        },
    },
    {
        key: '/admin/permission',
        title: 'Manage Permission',
        icon: <ApiOutlined />,
        access: {
            module: 'permission',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/permissions' }],
        },
    },
    {
        key: '/admin/role',
        title: 'Manage Role',
        icon: <ExceptionOutlined />,
        access: {
            module: 'role',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/roles' }],
        },
    },
    {
        key: '/admin/notification',
        title: 'Manage Notification',
        icon: <NotificationOutlined />,
        access: {
            module: 'notification',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/notifications' }],
        },
    },
    {
        key: '/admin/voucher',
        title: 'Manage Voucher',
        icon: <DollarOutlined />,
        access: {
            module: 'voucher',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/vouchers' }],
        },
    },
    {
        key: '/admin/flashsale',
        title: 'Manage Flash Sale',
        icon: <MoneyCollectOutlined />,
        access: {
            module: 'flashsale',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/flash-sales' }],
        },
    },
    {
        key: '/admin/slide',
        title: 'Manage Slide',
        icon: <SlidersOutlined />,
        access: {
            module: 'slide',
            anyPermissions: [{ method: 'GET', apiPath: '/api/v1/slides' }],
        },
    },
];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const { user, setUser, setIsAuthenticated, isAuthenticated, setCarts } = useCurrentApp();
    const navigate = useNavigate();
    const location = useLocation();
    const { roleName, hasModuleAccess, hasAnyPermission } = useAuthorization();

    const isItemAccessible = useCallback((access?: MenuAccessRule) => {
        if (!access) {
            return true;
        }

        const results: boolean[] = [];

        if (access.module) {
            results.push(hasModuleAccess(access.module));
        }

        if (access.anyPermissions && access.anyPermissions.length > 0) {
            results.push(hasAnyPermission(access.anyPermissions));
        }

        return results.length === 0 ? true : results.some(Boolean);
    }, [hasAnyPermission, hasModuleAccess]);

    const accessibleMenuConfig = useMemo(
        () => ADMIN_MENU_CONFIG.filter((item) => isItemAccessible(item.access)),
        [isItemAccessible]
    );

    const menuItems = useMemo<MenuItem[]>(
        () =>
            accessibleMenuConfig.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: <Link to={item.key}>{item.title}</Link>,
            })),
        [accessibleMenuConfig]
    );

    const accessibleKeys = useMemo(() => accessibleMenuConfig.map((item) => item.key), [accessibleMenuConfig]);
    const firstAccessibleKey = accessibleKeys[0] ?? '';

    const findConfigByPath = useCallback((path: string): AdminMenuItemConfig | undefined => {
        const sanitizedPath = path.split("?")[0];
        return [...ADMIN_MENU_CONFIG]
            .sort((a, b) => b.key.length - a.key.length)
            .find((item) => sanitizedPath === item.key || sanitizedPath.startsWith(`${item.key}/`));
    }, []);

    useEffect(() => {
        const sanitizedPath = location.pathname.split("?")[0];
        if (!sanitizedPath.startsWith('/admin')) {
            return;
        }

        const matched = accessibleMenuConfig.find(
            (item) => sanitizedPath === item.key || sanitizedPath.startsWith(`${item.key}/`)
        );

        if (matched) {
            setActiveMenu(matched.key);
        } else {
            setActiveMenu(firstAccessibleKey);
        }
    }, [accessibleMenuConfig, firstAccessibleKey, location.pathname]);

    useEffect(() => {
        const sanitizedPath = location.pathname.split("?")[0];
        if (!sanitizedPath.startsWith('/admin')) {
            return;
        }

        if (!accessibleMenuConfig.length) {
            return;
        }

        const matched = accessibleMenuConfig.find(
            (item) => sanitizedPath === item.key || sanitizedPath.startsWith(`${item.key}/`)
        );

        if (!matched && firstAccessibleKey && sanitizedPath !== firstAccessibleKey) {
            navigate(firstAccessibleKey, { replace: true });
        }
    }, [accessibleMenuConfig, firstAccessibleKey, location.pathname, navigate]);

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

    const sanitizedPath = useMemo(() => location.pathname.split("?")[0], [location.pathname]);
    const pathStartsWithAdmin = sanitizedPath.startsWith('/admin');
    const matchedConfig = useMemo(
        () => findConfigByPath(sanitizedPath),
        [findConfigByPath, sanitizedPath]
    );
    const hasAnyMenuAccess = accessibleMenuConfig.length > 0;
    const canAccessCurrentRoute = useMemo(() => {
        if (!pathStartsWithAdmin) {
            return true;
        }

        if (!matchedConfig) {
            return sanitizedPath === '/admin' ? hasAnyMenuAccess : false;
        }

        return isItemAccessible(matchedConfig.access);
    }, [hasAnyMenuAccess, isItemAccessible, matchedConfig, pathStartsWithAdmin, sanitizedPath]);

    const shouldShowForbidden = pathStartsWithAdmin && (
        !hasAnyMenuAccess ||
        (
            !canAccessCurrentRoute &&
            (!firstAccessibleKey || sanitizedPath === firstAccessibleKey)
        )
    );

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

    const isAdminRoute = sanitizedPath.includes("/admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        if (roleName === "USER") {
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
                    selectedKeys={activeMenu ? [activeMenu] : []}
                    mode="inline"
                    items={menuItems}
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
                    {shouldShowForbidden ? (
                        <Result
                            status="403"
                            title="403"
                            subTitle="Bạn không có quyền truy cập vào nội dung này."
                            extra={
                                <Space>
                                    {hasAnyMenuAccess && firstAccessibleKey ? (
                                        <Link to={firstAccessibleKey}>
                                            <Button type="primary">Tới trang được cấp quyền</Button>
                                        </Link>
                                    ) : (
                                        <Link to="/">
                                            <Button type="primary">Về trang chủ</Button>
                                        </Link>
                                    )}
                                </Space>
                            }
                        />
                    ) : (
                        <Outlet />
                    )}
                </Content>
                <Footer style={{ padding: 0, textAlign: "center" }}>
                    LaptopShop &copy;Ghost - Made with <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
