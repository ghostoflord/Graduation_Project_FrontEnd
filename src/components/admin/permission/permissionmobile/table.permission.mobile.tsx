import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography, Pagination, App } from 'antd';
import dayjs from 'dayjs';
import { callFetchPermissions } from '@/services/api';
import { colorMethod } from '@/utils/config';

const TablePermissionMobile = () => {
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();

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

    useEffect(() => {
        fetchPermissions();
    }, []);

    const paginatedPermissions = permissions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div style={{ padding: 12 }}>
            {loading ? (
                <Spin tip="Đang tải..." />
            ) : (
                <>
                    <Row gutter={[12, 12]}>
                        {paginatedPermissions.map((permission) => (
                            <Col xs={24} key={permission.id}>
                                <Card title={permission.name} size="small">
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
    );
};

export default TablePermissionMobile;
