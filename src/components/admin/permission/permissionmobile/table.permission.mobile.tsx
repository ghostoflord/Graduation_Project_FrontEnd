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
} from 'antd';
import {
    EditTwoTone,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { callFetchPermissions, callDeletePermission } from '@/services/api';
import { colorMethod } from '@/utils/config';
import CreatePermission from '../create.permission';
import DetailPermission from '../detail.permission';
import UpdatePermission from '../update.permission';
import { ActionType } from '@ant-design/pro-components';

const TablePermissionMobile = () => {
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();
    const actionRef = useRef<ActionType>();
    const tableRef = useRef<ActionType>();
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IPermission | null>(null);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IPermission | null>(null);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const res = await callFetchPermissions(`current=1&pageSize=100&sort=updatedAt,desc`);
            if (res?.data?.result) {
                setPermissions(res.data.result);
            }
        } catch (error) {
            message.error('Không thể tải danh sách quyền (permission)');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePermission = async (id?: number | string) => {
        if (id === undefined || id === null) {
            message.error('Không xác định được permission cần xóa');
            return;
        }
        try {
            const res = await callDeletePermission(id);
            if (res && res.statusCode === 200) {
                message.success('Xóa quyền thành công');
                fetchPermissions();
            } else {
                message.error(res.message || 'Xóa không thành công');
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra khi xóa permission');
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const paginatedPermissions = permissions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const refreshTable = () => {
        fetchPermissions();
    };

    return (
        <>
            <div style={{ padding: 12 }}>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    block
                    style={{ marginBottom: 12 }}
                    onClick={() => setOpenModalCreate(true)}
                >
                    Add New Permission
                </Button>

                {loading ? (
                    <Spin tip="Đang tải..." />
                ) : (
                    <>
                        <Row gutter={[12, 12]}>
                            {paginatedPermissions.map((permission) => (
                                <Col xs={24} key={permission.id}>
                                    <Card
                                        title={permission.name}
                                        size="small"
                                        extra={
                                            <Space>
                                                <EditTwoTone
                                                    twoToneColor="#f57800"
                                                    style={{ cursor: 'pointer', marginRight: 8 }}
                                                    onClick={() => {
                                                        setDataUpdate(permission);
                                                        setOpenModalUpdate(true);
                                                    }}
                                                />
                                                <Popconfirm
                                                    title="Xác nhận xóa permission?"
                                                    description="Bạn có chắc chắn muốn xóa permission này?"
                                                    onConfirm={() => handleDeletePermission(permission.id)}
                                                    okText="Xác nhận"
                                                    cancelText="Hủy"
                                                    placement="leftTop"
                                                >
                                                    <DeleteOutlined
                                                        style={{ fontSize: 18, color: '#ff4d4f', cursor: 'pointer' }}
                                                    />
                                                </Popconfirm>
                                            </Space>
                                        }
                                    >
                                        <Typography.Paragraph>
                                            <strong>API:</strong> {permission.apiPath}
                                        </Typography.Paragraph>
                                        <Typography.Paragraph>
                                            <strong>Method:</strong>{' '}
                                            <span style={{ color: colorMethod(permission.method || '') }}>
                                                {permission.method}
                                            </span>
                                        </Typography.Paragraph>
                                        <Typography.Paragraph>
                                            <strong>Module:</strong> {permission.module || 'Không có'}
                                        </Typography.Paragraph>
                                        <Typography.Paragraph>
                                            <strong>Ngày tạo:</strong>{' '}
                                            {dayjs(permission.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                                        </Typography.Paragraph>
                                        <Typography.Paragraph>
                                            <strong>Cập nhật:</strong>{' '}
                                            {dayjs(permission.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                                        </Typography.Paragraph>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={permissions.length}
                                onChange={setCurrentPage}
                                size="small"
                                simple={window.innerWidth < 1000}
                            />
                        </div>
                    </>
                )}
            </div>

            <CreatePermission
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <DetailPermission
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdatePermission
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TablePermissionMobile;
