import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography, Pagination, App } from 'antd';
import { callFetchRoles } from '@/services/api';
import dayjs from 'dayjs';

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

    useEffect(() => {
        fetchRoles();
    }, []);

    const paginatedRoles = roles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ padding: 12 }}>
            {loading ? (
                <Spin tip="Đang tải..." />
            ) : (
                <>
                    <Row gutter={[12, 12]}>
                        {paginatedRoles.map((role) => (
                            <Col xs={24} key={role.id}>
                                <Card title={role.name} size="small">
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
    );
};

export default TableRoleMobile;
