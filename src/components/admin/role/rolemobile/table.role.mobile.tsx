import { useEffect, useRef, useState } from 'react';
import {
    Card,
    Col,
    Row,
    Spin,
    Typography,
    Pagination,
    App,
    Button,
    Popconfirm,
    Space,
    notification
} from 'antd';
import {
    EditTwoTone,
    DeleteTwoTone,
    PlusOutlined,
} from '@ant-design/icons';
import { callFetchRoles, callDeleteRole } from '@/services/api';
import dayjs from 'dayjs';
import UpdateRole from '../update.role';
import CreateRole from '../create.role';
import DetailRole from '../detail.role';
import { ActionType } from '@ant-design/pro-components';

interface IRole {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

const TableRoleMobile = () => {
    const [roles, setRoles] = useState<IRole[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { message } = App.useApp();
    const actionRef = useRef<ActionType>();

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IRole | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IRole | null>(null);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [isDeleteRole, setIsDeleteRole] = useState<boolean>(false);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await callFetchRoles(`current=1&pageSize=100`);
            if (res?.data?.result) {
                setRoles(res.data.result);
            }
        } catch (error) {
            message.error('Không thể tải danh sách vai trò');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (id: string) => {
        setIsDeleteRole(true);
        try {
            const res = await callDeleteRole(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa role thành công');
                fetchRoles();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa role'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa role'
            });
        } finally {
            setIsDeleteRole(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const paginatedRoles = roles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const refreshTable = () => {
        fetchRoles();
    };

    return (
        <>
            <div style={{ padding: 12 }}>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setOpenModalCreate(true)}
                    block
                    style={{ marginBottom: 12 }}
                >
                    Add New Role
                </Button>

                {loading ? (
                    <Spin tip="Đang tải..." />
                ) : (
                    <>
                        <Row gutter={[12, 12]}>
                            {paginatedRoles.map((role) => (
                                <Col xs={24} key={role.id}>
                                    <Card
                                        title={role.name}
                                        size="small"
                                        extra={
                                            <Space>
                                                <EditTwoTone
                                                    twoToneColor="#f57800"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setDataUpdate(role);
                                                        setOpenModalUpdate(true);
                                                    }}
                                                />
                                                <Popconfirm
                                                    placement="leftTop"
                                                    title="Xác nhận xóa role"
                                                    description="Bạn có chắc chắn muốn xóa role này?"
                                                    onConfirm={() => handleDeleteRole(role.id)}
                                                    okText="Xác nhận"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ loading: isDeleteRole }}
                                                >
                                                    <DeleteTwoTone
                                                        twoToneColor="#ff4d4f"
                                                        style={{ cursor: 'pointer', marginLeft: 8 }}
                                                    />
                                                </Popconfirm>
                                            </Space>
                                        }
                                    >
                                        <Typography.Paragraph>
                                            <strong>Mô tả:</strong> {role.description || 'Không có'}
                                        </Typography.Paragraph>
                                        <div><strong>Ngày tạo:</strong> {dayjs(role.createdAt).format('DD-MM-YYYY')}</div>
                                        <div><strong>Cập nhật:</strong> {dayjs(role.updatedAt).format('DD-MM-YYYY')}</div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={roles.length}
                                onChange={setCurrentPage}
                                size="small"
                                simple={window.innerWidth < 1000}
                            />
                        </div>
                    </>
                )}
            </div>

            <UpdateRole
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                allPermissions={permissions}
            />

            <CreateRole
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <DetailRole
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default TableRoleMobile;
