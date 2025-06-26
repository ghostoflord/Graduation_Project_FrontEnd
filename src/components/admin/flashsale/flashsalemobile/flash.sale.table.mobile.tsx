import { useEffect, useState } from 'react';
import {
    Card,
    Tag,
    Spin,
    Row,
    Col,
    Typography,
    Tooltip,
    List,
    Pagination,
    App
} from 'antd';
import { getAllFlashSalesAPI } from '@/services/api';

interface IFlashSaleItem {
    id: number;
    productId: number;
    productName: string;
    originalPrice: number;
    salePrice: number;
    quantity: number;
}

interface IFlashSale {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    status: 'ACTIVE' | 'UPCOMING' | 'ENDED';
    items: IFlashSaleItem[];
}

const TableFlashSaleMobile = () => {
    const [loading, setLoading] = useState(true);
    const [flashSales, setFlashSales] = useState<IFlashSale[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();

    const fetchFlashSales = async () => {
        setLoading(true);
        try {
            const res = await getAllFlashSalesAPI('current=1&pageSize=100');
            if (res.data?.result) {
                setFlashSales(res.data.result);
            }
        } catch (error) {
            message.error('Không thể tải danh sách Flash Sale');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashSales();
    }, []);

    const paginatedData = flashSales.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const renderStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Tag color="green">Đang hoạt động</Tag>;
            case 'UPCOMING':
                return <Tag color="orange">Sắp diễn ra</Tag>;
            case 'ENDED':
                return <Tag color="red">Đã kết thúc</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    return (
        <div style={{ padding: 12 }}>
            {loading ? (
                <Spin tip="Loading..." />
            ) : (
                <>
                    <Row gutter={[12, 12]}>
                        {paginatedData.map((fs) => (
                            <Col xs={24} key={fs.id}>
                                <Card title={fs.name} size="small">
                                    <div><strong>ID:</strong> {fs.id}</div>
                                    <div><strong>Thời gian:</strong> {fs.startTime} → {fs.endTime}</div>
                                    <div>{renderStatus(fs.status)}</div>
                                    <div style={{ marginTop: 8 }}>
                                        <Tooltip
                                            title={
                                                <List
                                                    size="small"
                                                    dataSource={fs.items}
                                                    renderItem={(item) => (
                                                        <List.Item>
                                                            <Typography.Text>
                                                                {item.productName} - {item.salePrice.toLocaleString()}đ ({item.quantity} sp)
                                                            </Typography.Text>
                                                        </List.Item>
                                                    )}
                                                />
                                            }
                                        >
                                            <a>Xem chi tiết sản phẩm ({fs.items.length})</a>
                                        </Tooltip>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={flashSales.length}
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

export default TableFlashSaleMobile;
