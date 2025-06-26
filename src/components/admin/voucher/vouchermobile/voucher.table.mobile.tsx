import { useEffect, useState } from 'react';
import {
    Card,
    Tag,
    Spin,
    Row,
    Col,
    Typography,
    Pagination,
    App
} from 'antd';
import { getAllVouchersAPI } from '@/services/api';

interface IVoucher {
    id: number;
    code: string;
    description: string;
    discountValue: number;
    percentage: boolean;
    isSingleUse: boolean;
    used: boolean;
    isActive: boolean;
    startDate: string;
    endDate: string;
    assignedUser?: {
        name: string;
        email: string;
    };
}

const TableVoucherMobile = () => {
    const [loading, setLoading] = useState(true);
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await getAllVouchersAPI();
            if (res.data) {
                setVouchers(res.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách voucher');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const paginatedData = vouchers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ padding: 12 }}>
            {loading ? (
                <Spin tip="Loading..." />
            ) : (
                <>
                    <Row gutter={[12, 12]}>
                        {paginatedData.map((voucher) => (
                            <Col xs={24} key={voucher.id}>
                                <Card title={voucher.code} size="small">
                                    <Typography.Text>{voucher.description}</Typography.Text>
                                    <div><strong>Giá trị: </strong>{voucher.percentage ? `${voucher.discountValue}%` : `${voucher.discountValue.toLocaleString()}đ`}</div>
                                    <div><strong>Sử dụng một lần:</strong> <Tag color={voucher.isSingleUse ? 'orange' : 'blue'}>{voucher.isSingleUse ? 'Có' : 'Không'}</Tag></div>
                                    <div><strong>Trạng thái:</strong> <Tag color={voucher.isActive ? 'green' : 'gray'}>{voucher.isActive ? 'Hoạt động' : 'Ngưng'}</Tag></div>
                                    <div><strong>Đã dùng:</strong> <Tag color={voucher.used ? 'red' : 'green'}>{voucher.used ? 'Đã dùng' : 'Chưa dùng'}</Tag></div>
                                    <div><strong>Hiệu lực:</strong> {voucher.startDate} → {voucher.endDate}</div>
                                    <div>
                                        <strong>Người dùng:</strong>{' '}
                                        {voucher.assignedUser
                                            ? `${voucher.assignedUser.name} (${voucher.assignedUser.email})`
                                            : <Tag color="gray">Dùng chung</Tag>}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={vouchers.length}
                            onChange={(page) => setCurrentPage(page)}
                            size="small"
                            simple={window.innerWidth < 1000}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default TableVoucherMobile;
