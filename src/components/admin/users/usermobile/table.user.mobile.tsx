import { getUsersAPI, deleteUserAPI } from '@/services/api';
import { Card, Button, Tag, Avatar, Spin, Space, Popconfirm, App, Row, Col, Pagination, Result } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import CreateUser from '../create.user';
import UpdateUser from '../update.user';
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { useAuthorization } from '@/hooks/useAuthorization';

const TableUserMobile = () => {
    const [users, setUsers] = useState<IUserTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { message, notification } = App.useApp();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { hasPermission } = useAuthorization();

    const canViewUsers = hasPermission('GET', '/api/v1/users');
    const canCreateUser = hasPermission('POST', '/api/v1/users');
    const canUpdateUser = hasPermission('POST', '/api/v1/users/update') || hasPermission('PUT', '/api/v1/users/update');
    const canDeleteUser =
        hasPermission('DELETE', '/api/v1/users/:id') ||
        hasPermission('DELETE', '/api/v1/users/{id}') ||
        hasPermission('DELETE', '/api/v1/users');
    const canExportUser = canViewUsers;

    const fetchUsers = useCallback(async () => {
        if (!canViewUsers) {
            setUsers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await getUsersAPI('current=1&pageSize=100'); // lấy hết rồi phân trang local
            if (res.data?.result) {
                setUsers(res.data.result);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }, [canViewUsers]);

    const handleDeleteUser = async (id: string) => {
        const canDeleteTarget =
            canDeleteUser ||
            hasPermission('DELETE', `/api/v1/users/${id}`);

        if (!canDeleteTarget) {
            message.error('Bạn không có quyền xóa người dùng.');
            return;
        }

        setIsDeleting(true);
        try {
            const res = await deleteUserAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa user thành công');
                fetchUsers();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa user',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa user',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (!canViewUsers) {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Bạn không có quyền xem danh sách người dùng."
            />
        );
    }

    return (
        <div style={{ padding: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                {canCreateUser && (
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                        block
                    >
                        Add New User
                    </Button>
                )}

                {canExportUser && (
                    <CSVLink data={users} filename="export-user.csv">
                        <Button icon={<ExportOutlined />} type="primary" block>
                            Export
                        </Button>
                    </CSVLink>
                )}

                {loading ? (
                    <Spin tip="Loading..." />
                ) : (
                    <>
                        <Row gutter={[12, 12]}>
                            {paginatedUsers.map(user => (
                                <Col xs={24} key={user.id}>
                                    <Card title={user.name} size="small">
                                        <Space align="start">
                                            <Avatar
                                                src={
                                                    user.avatar
                                                        ? `${import.meta.env.VITE_BACKEND_URL}/upload/avatars/${user.avatar}`
                                                        : undefined
                                                }
                                                size={48}
                                            >
                                                {!user.avatar && user.name?.charAt(0)}
                                            </Avatar>
                                            <div>
                                                <div><strong>Email:</strong> {user.email}</div>
                                                <div><strong>Age:</strong> {user.age}</div>
                                                <div><strong>Gender:</strong> {user.gender}</div>
                                                <div><strong>Address:</strong> {user.address}</div>
                                                  <div>
                                                      <Tag color={user.activate ? 'green' : 'red'}>
                                                          {user.activate ? 'Active' : 'Inactive'}
                                                      </Tag>
                                                  </div>
                                                  {(canUpdateUser || canDeleteUser) && (
                                                      <div style={{ marginTop: 8 }}>
                                                          {canUpdateUser && (
                                                              <EditTwoTone
                                                                  twoToneColor="#f57800"
                                                                  style={{ marginRight: 16, fontSize: 18, cursor: 'pointer' }}
                                                                  onClick={() => {
                                                                      setDataUpdate(user);
                                                                      setOpenModalUpdate(true);
                                                                  }}
                                                              />
                                                          )}
                                                          {canDeleteUser && (
                                                              <Popconfirm
                                                                  placement="bottom"
                                                                  title="Xác nhận xóa user?"
                                                                  onConfirm={() => handleDeleteUser(user.id)}
                                                                  okText="Xác nhận"
                                                                  cancelText="Hủy"
                                                                  okButtonProps={{ loading: isDeleting }}
                                                              >
                                                                  <DeleteTwoTone
                                                                      twoToneColor="#ff4d4f"
                                                                      style={{ fontSize: 18, cursor: 'pointer' }}
                                                                  />
                                                              </Popconfirm>
                                                          )}
                                                      </div>
                                                  )}
                                            </div>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={users.length}
                                onChange={(page) => setCurrentPage(page)}
                                size="small"
                                responsive
                                simple={window.innerWidth < 1000}
                            />
                        </div>
                    </>
                )}
            </Space>

            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={fetchUsers}
            />

            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={fetchUsers}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </div>
    );
};
export default TableUserMobile;
